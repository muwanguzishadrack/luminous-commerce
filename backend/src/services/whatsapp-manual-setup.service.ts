import { PrismaClient } from '@prisma/client';
import { MetaService } from './meta.service';
import { WhatsAppService } from './whatsapp.service';
import { 
  ManualSetupCredentials,
  WhatsAppConfig,
  WhatsAppError 
} from '../types/whatsapp';

const prisma = new PrismaClient();

export class WhatsAppManualSetupService {
  private metaService: MetaService;

  constructor() {
    this.metaService = new MetaService();
  }

  /**
   * Validate the 4 required manual setup credentials
   */
  validateCredentials(credentials: ManualSetupCredentials): void {
    const required = ['access_token', 'app_id', 'phone_number_id', 'waba_id'];
    const missing = required.filter(field => !credentials[field as keyof ManualSetupCredentials]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Basic format validation
    if (!credentials.access_token.startsWith('EAA')) {
      throw new Error('Invalid access token format. Should start with "EAA"');
    }

    if (!/^\d+$/.test(credentials.app_id)) {
      throw new Error('Invalid app_id format. Should be numeric');
    }

    if (!/^\d+$/.test(credentials.phone_number_id)) {
      throw new Error('Invalid phone_number_id format. Should be numeric');
    }

    if (!/^\d+$/.test(credentials.waba_id)) {
      throw new Error('Invalid waba_id format. Should be numeric');
    }
  }

  /**
   * Setup manual WhatsApp configuration for organization
   */
  async setupManualConfiguration(
    organizationId: string, 
    credentials: ManualSetupCredentials
  ): Promise<WhatsAppConfig> {
    try {
      // Step 1: Validate input credentials
      this.validateCredentials(credentials);

      const { access_token, app_id, phone_number_id, waba_id } = credentials;

      // Step 2: Validate access token with Facebook API
      await this.validateAccessToken(access_token, app_id, waba_id);

      // Step 3: Get phone number details from WABA
      const phoneNumberResponse = await this.metaService.makeGraphApiCall(
        `${waba_id}/phone_numbers`,
        'GET',
        null,
        access_token
      );

      // Find the specific phone number in the response
      const phoneNumber = phoneNumberResponse.data?.find(
        (phone: any) => phone.id === phone_number_id
      );

      if (!phoneNumber) {
        throw new Error(`Phone number ID ${phone_number_id} not found in WABA ${waba_id}`);
      }

      // Step 4: Get phone number status
      const phoneNumberStatus = await this.metaService.makeGraphApiCall(
        phone_number_id,
        'GET',
        null,
        access_token,
        { fields: 'status,code_verification_status' }
      );

      // Step 5: Get account review status
      const accountReviewStatus = await this.metaService.makeGraphApiCall(
        waba_id,
        'GET',
        null,
        access_token,
        { fields: 'account_review_status' }
      );

      // Step 6: Get business profile
      const businessProfile = await this.metaService.makeGraphApiCall(
        `${phone_number_id}/whatsapp_business_profile`,
        'GET',
        null,
        access_token
      );

      // Step 7: Prepare WhatsApp configuration object
      const whatsappConfig: WhatsAppConfig = {
        is_embedded_signup: false,
        access_token,
        app_id,
        phone_number_id,
        waba_id,
        display_phone_number: phoneNumber.display_phone_number,
        verified_name: phoneNumber.verified_name,
        quality_rating: phoneNumber.quality_rating,
        name_status: phoneNumber.name_status,
        messaging_limit_tier: phoneNumber.messaging_limit_tier,
        number_status: phoneNumberStatus.status,
        code_verification_status: phoneNumberStatus.code_verification_status,
        account_review_status: accountReviewStatus.account_review_status,
        business_profile: businessProfile.data?.[0] ? {
          about: businessProfile.data[0].about || '',
          address: businessProfile.data[0].address || '',
          description: businessProfile.data[0].description || '',
          vertical: businessProfile.data[0].vertical || '',
          email: businessProfile.data[0].email || '',
        } : {
          about: '',
          address: '',
          description: '',
          vertical: '',
          email: '',
        }
      };

      // Step 8: Store configuration in organization metadata
      await this.storeConfiguration(organizationId, whatsappConfig);

      // Step 9: Sync templates from Facebook
      try {
        const whatsappService = new WhatsAppService(organizationId);
        await whatsappService.syncTemplates();
      } catch (error) {
        console.warn('Template sync failed during setup:', error);
        // Don't fail the entire setup if template sync fails
      }

      return whatsappConfig;

    } catch (error: any) {
      console.error('Manual setup failed:', error);
      
      const whatsappError: WhatsAppError = new Error(
        error.message || 'Failed to setup WhatsApp configuration'
      );
      whatsappError.code = error.code;
      whatsappError.details = error.details || error;
      
      throw whatsappError;
    }
  }

  /**
   * Validate access token with Facebook API
   */
  private async validateAccessToken(
    accessToken: string, 
    appId: string, 
    wabaId: string
  ): Promise<void> {
    try {
      // Try to make a simple API call to validate the token
      const response = await this.metaService.makeGraphApiCall(
        wabaId,
        'GET',
        null,
        accessToken,
        { fields: 'id,name' }
      );

      if (!response.id || response.id !== wabaId) {
        throw new Error('Access token does not have permission to access the specified WABA');
      }

    } catch (error: any) {
      if (error.message?.includes('Invalid OAuth access token')) {
        throw new Error('Invalid access token. Please generate a new token from Facebook Developer Console.');
      }
      
      if (error.message?.includes('Insufficient permissions')) {
        throw new Error('Access token does not have sufficient permissions for WhatsApp Business API.');
      }

      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  /**
   * Store WhatsApp configuration in organization metadata
   */
  private async storeConfiguration(
    organizationId: string, 
    config: WhatsAppConfig
  ): Promise<void> {
    // Get current organization metadata
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { metadata: true }
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    // Update metadata with WhatsApp configuration
    const currentMetadata = organization.metadata as any || {};
    const updatedMetadata = {
      ...currentMetadata,
      whatsapp: config
    };

    await prisma.organization.update({
      where: { id: organizationId },
      data: { metadata: updatedMetadata }
    });
  }

  /**
   * Refresh configuration data from Facebook API
   */
  async refreshConfiguration(organizationId: string): Promise<WhatsAppConfig> {
    try {
      // Get current configuration
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { metadata: true }
      });

      if (!organization?.metadata || !(organization.metadata as any).whatsapp) {
        throw new Error('WhatsApp not configured for this organization');
      }

      const currentConfig = (organization.metadata as any).whatsapp as WhatsAppConfig;
      
      // Re-setup with existing credentials to refresh data
      const credentials: ManualSetupCredentials = {
        access_token: currentConfig.access_token!,
        app_id: currentConfig.app_id!,
        phone_number_id: currentConfig.phone_number_id!,
        waba_id: currentConfig.waba_id!
      };

      return await this.setupManualConfiguration(organizationId, credentials);

    } catch (error: any) {
      console.error('Configuration refresh failed:', error);
      
      const whatsappError: WhatsAppError = new Error(
        error.message || 'Failed to refresh WhatsApp configuration'
      );
      whatsappError.code = error.code;
      whatsappError.details = error.details || error;
      
      throw whatsappError;
    }
  }

  /**
   * Update only the access token for an organization
   */
  async updateAccessToken(
    organizationId: string, 
    newAccessToken: string
  ): Promise<WhatsAppConfig> {
    try {
      // Get current configuration
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { metadata: true }
      });

      if (!organization?.metadata || !(organization.metadata as any).whatsapp) {
        throw new Error('WhatsApp not configured for this organization');
      }

      const currentConfig = (organization.metadata as any).whatsapp as WhatsAppConfig;
      
      // Setup with new access token
      const credentials: ManualSetupCredentials = {
        access_token: newAccessToken,
        app_id: currentConfig.app_id!,
        phone_number_id: currentConfig.phone_number_id!,
        waba_id: currentConfig.waba_id!
      };

      return await this.setupManualConfiguration(organizationId, credentials);

    } catch (error: any) {
      console.error('Access token update failed:', error);
      
      const whatsappError: WhatsAppError = new Error(
        error.message || 'Failed to update access token'
      );
      whatsappError.code = error.code;
      whatsappError.details = error.details || error;
      
      throw whatsappError;
    }
  }

  /**
   * Get webhook configuration for organization
   */
  async getWebhookConfig(organizationId: string): Promise<{
    webhookUrl: string;
    verifyToken: string;
  }> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { slug: true }
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    
    return {
      webhookUrl: `${baseUrl}/api/webhook/whatsapp/${organization.slug}`,
      verifyToken: organization.slug
    };
  }
}