import { api } from '../lib/api';
import { 
  WhatsAppConfig, 
  BusinessProfile, 
  ValidationResult, 
  AccountStatus 
} from '../types/whatsapp';

export interface WhatsAppSetupResult {
  phone_number_id: string;
  display_phone_number: string;
  verified_name: string;
  quality_rating: string;
  account_review_status: string;
  business_profile: BusinessProfile;
}

export class WhatsAppService {
  /**
   * Handle embedded signup OAuth flow
   */
  static async handleEmbeddedSignup(
    code: string,
    state?: string
  ): Promise<{ success: boolean; data?: WhatsAppSetupResult; error?: string }> {
    try {
      const response = await api.get('/whatsapp/exchange-code', {
        params: { code, state },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to complete embedded signup');
    }
  }

  /**
   * Get WhatsApp configuration for organization
   */
  static async getWhatsAppSettings(orgId: string): Promise<WhatsAppConfig> {
    try {
      const response = await api.get(`/whatsapp/settings/${orgId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get WhatsApp settings');
    }
  }

  /**
   * Update WhatsApp configuration
   */
  static async updateWhatsAppSettings(
    orgId: string,
    updates: Partial<WhatsAppConfig>
  ): Promise<void> {
    try {
      await api.put(`/whatsapp/settings/${orgId}`, updates);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update WhatsApp settings');
    }
  }

  /**
   * Get account status and health
   */
  static async getAccountStatus(orgId: string): Promise<AccountStatus> {
    try {
      const response = await api.get(`/whatsapp/status/${orgId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get account status');
    }
  }

  /**
   * Validate WhatsApp configuration
   */
  static async validateConfiguration(orgId: string): Promise<ValidationResult> {
    try {
      const response = await api.get(`/whatsapp/validate/${orgId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to validate configuration');
    }
  }

  /**
   * Get business profile
   */
  static async getBusinessProfile(orgId: string): Promise<BusinessProfile> {
    try {
      const response = await api.get(`/whatsapp/business-profile/${orgId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get business profile');
    }
  }

  /**
   * Update business profile
   */
  static async updateBusinessProfile(
    orgId: string,
    profile: Partial<BusinessProfile>
  ): Promise<void> {
    try {
      await api.post(`/whatsapp/business-profile/${orgId}`, profile);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update business profile');
    }
  }

  /**
   * Send a WhatsApp message
   */
  static async sendMessage(messageData: {
    to: string;
    type: string;
    content: any;
    conversationId?: string;
  }): Promise<any> {
    try {
      const response = await api.post('/whatsapp/send', messageData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  /**
   * Send a template message
   */
  static async sendTemplateMessage(templateData: {
    to: string;
    templateName: string;
    languageCode: string;
    components?: any[];
  }): Promise<any> {
    try {
      const response = await api.post('/whatsapp/send/template', templateData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send template message');
    }
  }

  /**
   * Get templates for organization
   */
  static async getTemplates(orgId: string): Promise<any[]> {
    try {
      const response = await api.get(`/whatsapp/templates/${orgId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get templates');
    }
  }

  /**
   * Sync templates from Facebook
   */
  static async syncTemplates(orgId: string): Promise<void> {
    try {
      await api.post(`/whatsapp/templates/${orgId}/sync`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to sync templates');
    }
  }

  /**
   * Get conversation messages
   */
  static async getConversationMessages(
    conversationId: string,
    limit = 50
  ): Promise<any[]> {
    try {
      const response = await api.get(`/whatsapp/conversations/${conversationId}/messages`, {
        params: { limit },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get messages');
    }
  }

  /**
   * Generate Meta embedded signup URL
   */
  static generateEmbeddedSignupUrl(
    appId: string,
    configId: string,
    redirectUrl: string,
    state?: string
  ): string {
    const params = new URLSearchParams({
      client_id: appId,
      config_id: configId,
      response_type: 'code',
      override_default_response_type: 'true',
      extras: JSON.stringify({
        feature: 'whatsapp_embedded_signup',
        version: 1,
      }),
      redirect_uri: redirectUrl,
      ...(state && { state }),
    });

    return `https://www.facebook.com/dialog/oauth?${params.toString()}`;
  }

  /**
   * Check if WhatsApp is configured for organization
   */
  static async isWhatsAppConfigured(orgId: string): Promise<boolean> {
    try {
      const config = await this.getWhatsAppSettings(orgId);
      return !!(
        config.app_id &&
        config.phone_number_id &&
        config.waba_id &&
        config.is_embedded_signup
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get setup progress for organization
   */
  static async getSetupProgress(orgId: string): Promise<{
    isConfigured: boolean;
    hasPhoneNumber: boolean;
    hasBusinessProfile: boolean;
    accountStatus: string;
    qualityRating: string;
  }> {
    try {
      const config = await this.getWhatsAppSettings(orgId);
      
      return {
        isConfigured: !!(config.app_id && config.waba_id && config.phone_number_id),
        hasPhoneNumber: !!config.display_phone_number,
        hasBusinessProfile: !!(config.business_profile?.about || config.business_profile?.description),
        accountStatus: config.account_review_status || 'UNKNOWN',
        qualityRating: config.quality_rating || 'UNKNOWN',
      };
    } catch (error) {
      return {
        isConfigured: false,
        hasPhoneNumber: false,
        hasBusinessProfile: false,
        accountStatus: 'UNKNOWN',
        qualityRating: 'UNKNOWN',
      };
    }
  }
}