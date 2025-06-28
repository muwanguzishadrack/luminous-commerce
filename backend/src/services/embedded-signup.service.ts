import { PrismaClient } from '@prisma/client';
import { MetaService } from './meta.service';
import { 
  WhatsAppConfig, 
  BusinessProfile, 
  CreateWhatsAppConfigRequest,
  WhatsAppError 
} from '../types/whatsapp';

const prisma = new PrismaClient();

export class EmbeddedSignupService {
  private metaService: MetaService;

  constructor() {
    this.metaService = new MetaService();
  }

  /**
   * Handle complete embedded signup flow (10 steps matching Laravel implementation)
   */
  async handleSignupFlow(
    authorizationCode: string,
    organizationId: string,
    pin?: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Get system-level WhatsApp configuration
      const systemConfig = await this.getSystemConfig();
      if (!systemConfig) {
        throw new Error('System WhatsApp configuration not found. Please configure in admin settings.');
      }

      const redirectUri = `${process.env.APP_URL}/api/whatsapp/exchange-code`;

      // Step 1: Exchange authorization code for access token
      console.log('Step 1: Exchanging authorization code for access token...');
      const tokenResponse = await this.metaService.exchangeCodeForToken(
        authorizationCode,
        systemConfig.client_id,
        systemConfig.client_secret,
        redirectUri
      );

      const accessToken = tokenResponse.access_token;

      // Step 2: Debug token to validate and extract WABA and App IDs
      console.log('Step 2: Debugging token...');
      const debugResponse = await this.metaService.debugToken(
        accessToken,
        systemConfig.app_id,
        systemConfig.client_secret
      );

      const appId = debugResponse.data.app_id;
      const userId = debugResponse.data.user_id; // This is the WABA ID

      // Step 3: Get phone numbers from WABA
      console.log('Step 3: Getting phone numbers...');
      const phoneNumbersResponse = await this.metaService.getWabaPhoneNumbers(userId, accessToken);
      
      if (!phoneNumbersResponse.data || phoneNumbersResponse.data.length === 0) {
        throw new Error('No phone numbers found in WhatsApp Business Account');
      }

      const phoneNumber = phoneNumbersResponse.data[0]; // Use first phone number
      const phoneNumberId = phoneNumber.id;
      const displayPhoneNumber = phoneNumber.display_phone_number;
      const verifiedName = phoneNumber.verified_name;

      // Step 4: Get phone number status details
      console.log('Step 4: Getting phone number status...');
      const phoneDetails = await this.metaService.getPhoneNumberDetails(phoneNumberId, accessToken);
      
      const qualityRating = phoneDetails.quality_rating || 'UNKNOWN';
      const nameStatus = phoneDetails.name_status || 'UNVERIFIED';
      const messagingLimitTier = phoneDetails.messaging_limit_tier || 'TIER_1000';

      // Step 5: Get account review status
      console.log('Step 5: Getting account review status...');
      const reviewResponse = await this.metaService.getAccountReviewStatus(userId, accessToken);
      const accountReviewStatus = reviewResponse.account_review_status || 'PENDING';

      // Step 6: Register phone number (if pin provided)
      if (pin) {
        console.log('Step 6: Registering phone number...');
        await this.metaService.registerPhoneNumber(phoneNumberId, accessToken, pin);
      }

      // Step 7: Get business profile
      console.log('Step 7: Getting business profile...');
      const businessProfileResponse = await this.metaService.getBusinessProfile(phoneNumberId, accessToken);
      const businessProfile: BusinessProfile = businessProfileResponse.data?.[0] || {};

      // Step 8: Subscribe to WABA webhooks
      console.log('Step 8: Subscribing to WABA...');
      await this.metaService.subscribeToWaba(userId, accessToken);

      // Step 9: Set organization-specific callback URL
      console.log('Step 9: Setting callback URL...');
      // This will be called after storing metadata to get the organization slug

      // Step 10: Store all metadata in organization
      console.log('Step 10: Storing WhatsApp configuration...');
      const whatsappConfig: WhatsAppConfig = {
        is_embedded_signup: true,
        access_token: accessToken,
        app_id: appId,
        client_id: systemConfig.client_id,
        client_secret: systemConfig.client_secret,
        config_id: systemConfig.config_id,
        waba_id: userId,
        phone_number_id: phoneNumberId,
        display_phone_number: displayPhoneNumber,
        verified_name: verifiedName,
        quality_rating: qualityRating,
        name_status: nameStatus,
        messaging_limit_tier: messagingLimitTier,
        account_review_status: accountReviewStatus,
        business_profile: businessProfile,
      };

      // Update organization metadata
      await this.storeWhatsAppConfig(organizationId, whatsappConfig);

      // Now set the callback URL with the organization identifier
      try {
        await this.metaService.overrideWabaCallbackUrl(organizationId);
      } catch (callbackError) {
        console.warn('Warning: Failed to set callback URL:', callbackError);
        // Don't fail the entire process for callback URL issues
      }

      // Sync templates from Facebook
      console.log('Syncing templates...');
      try {
        await this.syncTemplates(organizationId);
      } catch (templateError) {
        console.warn('Warning: Failed to sync templates:', templateError);
        // Don't fail the entire process for template sync issues
      }

      return {
        success: true,
        data: {
          phone_number_id: phoneNumberId,
          display_phone_number: displayPhoneNumber,
          verified_name: verifiedName,
          quality_rating: qualityRating,
          account_review_status: accountReviewStatus,
          business_profile: businessProfile,
        },
      };

    } catch (error: any) {
      console.error('Embedded signup flow error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete embedded signup',
      };
    }
  }

  /**
   * Store WhatsApp configuration in organization metadata
   */
  async storeWhatsAppConfig(organizationId: string, config: WhatsAppConfig): Promise<void> {
    try {
      // Get current organization metadata
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { metadata: true },
      });

      const currentMetadata = (organization?.metadata as any) || {};
      
      // Update WhatsApp configuration in metadata
      const updatedMetadata = {
        ...currentMetadata,
        whatsapp: config,
      };

      // Save to database
      await prisma.organization.update({
        where: { id: organizationId },
        data: { metadata: updatedMetadata },
      });

    } catch (error: any) {
      throw new Error(`Failed to store WhatsApp configuration: ${error.message}`);
    }
  }

  /**
   * Get WhatsApp configuration from organization metadata
   */
  async getWhatsAppConfig(organizationId: string): Promise<WhatsAppConfig | null> {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { metadata: true },
      });

      if (!organization?.metadata) {
        return null;
      }

      const metadata = organization.metadata as any;
      return metadata.whatsapp || null;

    } catch (error: any) {
      throw new Error(`Failed to get WhatsApp configuration: ${error.message}`);
    }
  }

  /**
   * Update WhatsApp configuration
   */
  async updateWhatsAppConfig(
    organizationId: string,
    updates: Partial<WhatsAppConfig>
  ): Promise<void> {
    try {
      const currentConfig = await this.getWhatsAppConfig(organizationId);
      if (!currentConfig) {
        throw new Error('WhatsApp configuration not found');
      }

      const updatedConfig = { ...currentConfig, ...updates };
      await this.storeWhatsAppConfig(organizationId, updatedConfig);

    } catch (error: any) {
      throw new Error(`Failed to update WhatsApp configuration: ${error.message}`);
    }
  }

  /**
   * Sync templates from Facebook to local database
   */
  async syncTemplates(organizationId: string): Promise<void> {
    try {
      const config = await this.getWhatsAppConfig(organizationId);
      if (!config?.access_token || !config?.waba_id) {
        throw new Error('WhatsApp configuration not found');
      }

      // Get templates from Facebook
      const templatesResponse = await this.metaService.getMessageTemplates(
        config.waba_id,
        config.access_token
      );

      if (!templatesResponse.data) {
        return; // No templates to sync
      }

      // Store/update templates in database
      for (const template of templatesResponse.data) {
        await prisma.whatsAppTemplate.upsert({
          where: {
            organizationId_metaId: {
              organizationId: organizationId,
              metaId: template.id,
            },
          },
          update: {
            name: template.name,
            language: template.language,
            category: template.category.toUpperCase(),
            status: template.status.toUpperCase(),
            metadata: template,
            rejectionReason: template.rejected_reason || null,
          },
          create: {
            organizationId: organizationId,
            metaId: template.id,
            name: template.name,
            language: template.language,
            category: template.category.toUpperCase(),
            status: template.status.toUpperCase(),
            metadata: template,
            rejectionReason: template.rejected_reason || null,
          },
        });
      }

    } catch (error: any) {
      throw new Error(`Failed to sync templates: ${error.message}`);
    }
  }

  /**
   * Get system-level WhatsApp configuration
   */
  private async getSystemConfig(): Promise<{
    app_id: string;
    client_id: string;
    client_secret: string;
    config_id: string;
  } | null> {
    try {
      // In a real implementation, you might store this in a settings table
      // For now, we'll use environment variables or a dedicated table
      
      const appId = process.env.WHATSAPP_APP_ID;
      const clientId = process.env.WHATSAPP_CLIENT_ID;
      const clientSecret = process.env.WHATSAPP_CLIENT_SECRET;
      const configId = process.env.WHATSAPP_CONFIG_ID;

      if (!appId || !clientId || !clientSecret || !configId) {
        return null;
      }

      return {
        app_id: appId,
        client_id: clientId,
        client_secret: clientSecret,
        config_id: configId,
      };

    } catch (error: any) {
      console.error('Failed to get system config:', error);
      return null;
    }
  }

  /**
   * Validate WhatsApp configuration
   */
  async validateConfig(organizationId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const config = await this.getWhatsAppConfig(organizationId);
      
      if (!config) {
        errors.push('WhatsApp configuration not found');
        return { isValid: false, errors, warnings };
      }

      // Check required fields
      if (!config.access_token) errors.push('Access token is missing');
      if (!config.app_id) errors.push('App ID is missing');
      if (!config.waba_id) errors.push('WABA ID is missing');
      if (!config.phone_number_id) errors.push('Phone Number ID is missing');

      // Check token validity
      if (config.access_token && config.app_id && config.client_secret) {
        try {
          await this.metaService.debugToken(
            config.access_token,
            config.app_id,
            config.client_secret
          );
        } catch (error: any) {
          errors.push('Access token is invalid or expired');
        }
      }

      // Check account status
      if (config.account_review_status !== 'APPROVED') {
        warnings.push(`Account review status: ${config.account_review_status}`);
      }

      if (config.quality_rating && !['GREEN', 'YELLOW'].includes(config.quality_rating)) {
        warnings.push(`Quality rating: ${config.quality_rating}`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };

    } catch (error: any) {
      errors.push(`Validation failed: ${error.message}`);
      return { isValid: false, errors, warnings };
    }
  }

  /**
   * Get WhatsApp account status and health
   */
  async getAccountStatus(organizationId: string): Promise<any> {
    try {
      const config = await this.getWhatsAppConfig(organizationId);
      if (!config?.access_token || !config?.phone_number_id || !config?.waba_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      // Get current phone number details
      const phoneDetails = await this.metaService.getPhoneNumberDetails(
        config.phone_number_id,
        config.access_token
      );

      // Get account review status
      const reviewStatus = await this.metaService.getAccountReviewStatus(
        config.waba_id,
        config.access_token
      );

      // Get business profile
      const businessProfile = await this.metaService.getBusinessProfile(
        config.phone_number_id,
        config.access_token
      );

      return {
        phone_details: phoneDetails,
        review_status: reviewStatus,
        business_profile: businessProfile.data?.[0] || {},
        last_updated: new Date().toISOString(),
      };

    } catch (error: any) {
      throw new Error(`Failed to get account status: ${error.message}`);
    }
  }
}