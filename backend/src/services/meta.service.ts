import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PrismaClient } from '@prisma/client';
import { 
  MetaOAuthResponse, 
  MetaTokenDebugResponse, 
  WhatsAppConfig,
  WhatsAppError 
} from '../types/whatsapp';

const prisma = new PrismaClient();

export class MetaService {
  private readonly apiVersion: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiVersion = process.env.GRAPH_API_VERSION || 'v20.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Make a generic Graph API call
   */
  async makeGraphApiCall<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    accessToken?: string,
    params?: Record<string, any>
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: `${this.baseUrl}/${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: params || {},
      };

      if (accessToken) {
        config.headers!['Authorization'] = `Bearer ${accessToken}`;
      }

      if (data && (method === 'POST' || method === 'PUT')) {
        config.data = data;
      }

      const response: AxiosResponse<T> = await axios(config);
      return response.data;
    } catch (error: any) {
      const whatsappError: WhatsAppError = new Error(
        error.response?.data?.error?.message || error.message || 'Graph API call failed'
      );
      whatsappError.code = error.response?.data?.error?.code || error.code;
      whatsappError.details = error.response?.data?.error || error;
      whatsappError.statusCode = error.response?.status;

      throw whatsappError;
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    code: string,
    clientId?: string,
    clientSecret?: string,
    redirectUri?: string
  ): Promise<MetaOAuthResponse> {
    // Use environment variables as defaults
    const finalClientId = clientId || process.env.WHATSAPP_APP_ID;
    const finalClientSecret = clientSecret || process.env.WHATSAPP_CLIENT_SECRET;
    const finalRedirectUri = redirectUri || `${process.env.APP_BASE_URL}/whatsapp/callback`;

    if (!finalClientId || !finalClientSecret) {
      throw new Error('WhatsApp client credentials not configured. Please set WHATSAPP_APP_ID and WHATSAPP_CLIENT_SECRET.');
    }
    const params = {
      client_id: finalClientId,
      client_secret: finalClientSecret,
      code: code,
      redirect_uri: finalRedirectUri,
    };

    return this.makeGraphApiCall<MetaOAuthResponse>(
      'oauth/access_token',
      'POST',
      null,
      undefined,
      params
    );
  }

  /**
   * Debug and validate access token
   */
  async debugToken(
    accessToken: string,
    appId?: string,
    appSecret?: string
  ): Promise<MetaTokenDebugResponse> {
    // Use environment variables as defaults
    const finalAppId = appId || process.env.WHATSAPP_APP_ID;
    const finalAppSecret = appSecret || process.env.WHATSAPP_CLIENT_SECRET;

    if (!finalAppId || !finalAppSecret) {
      throw new Error('WhatsApp app credentials not configured. Please set WHATSAPP_APP_ID and WHATSAPP_CLIENT_SECRET.');
    }
    const params = {
      input_token: accessToken,
      access_token: `${finalAppId}|${finalAppSecret}`,
    };

    return this.makeGraphApiCall<MetaTokenDebugResponse>(
      'debug_token',
      'GET',
      null,
      undefined,
      params
    );
  }

  /**
   * Get WhatsApp Business Account phone numbers
   */
  async getWabaPhoneNumbers(wabaId: string, accessToken: string): Promise<any> {
    return this.makeGraphApiCall(
      `${wabaId}/phone_numbers`,
      'GET',
      null,
      accessToken
    );
  }

  /**
   * Get phone number details and status
   */
  async getPhoneNumberDetails(phoneNumberId: string, accessToken: string): Promise<any> {
    const params = {
      fields: 'status,display_phone_number,verified_name,quality_rating,name_status,messaging_limit_tier',
    };

    return this.makeGraphApiCall(
      phoneNumberId,
      'GET',
      null,
      accessToken,
      params
    );
  }

  /**
   * Get WABA account review status
   */
  async getAccountReviewStatus(wabaId: string, accessToken: string): Promise<any> {
    const params = {
      fields: 'account_review_status',
    };

    return this.makeGraphApiCall(
      wabaId,
      'GET',
      null,
      accessToken,
      params
    );
  }

  /**
   * Register phone number with WhatsApp
   */
  async registerPhoneNumber(
    phoneNumberId: string,
    accessToken: string,
    pin?: string
  ): Promise<any> {
    const data: any = {
      messaging_product: 'whatsapp',
    };

    if (pin) {
      data.pin = pin;
    }

    return this.makeGraphApiCall(
      `${phoneNumberId}/register`,
      'POST',
      data,
      accessToken
    );
  }

  /**
   * Get WhatsApp Business Profile
   */
  async getBusinessProfile(phoneNumberId: string, accessToken: string): Promise<any> {
    const params = {
      fields: 'about,address,description,industry,email,profile_picture_url,websites,vertical',
    };

    return this.makeGraphApiCall(
      `${phoneNumberId}/whatsapp_business_profile`,
      'GET',
      null,
      accessToken,
      params
    );
  }

  /**
   * Update WhatsApp Business Profile
   */
  async updateBusinessProfile(
    phoneNumberId: string,
    accessToken: string,
    profile: any
  ): Promise<any> {
    const data = {
      messaging_product: 'whatsapp',
      ...profile,
    };

    return this.makeGraphApiCall(
      `${phoneNumberId}/whatsapp_business_profile`,
      'POST',
      data,
      accessToken
    );
  }

  /**
   * Subscribe app to WABA webhooks
   */
  async subscribeToWaba(wabaId: string, accessToken: string): Promise<any> {
    const data = {
      subscribed_fields: [
        'messages',
        'message_deliveries',
        'message_reads',
        'message_reactions',
        'message_echoes'
      ].join(','),
    };

    return this.makeGraphApiCall(
      `${wabaId}/subscribed_apps`,
      'POST',
      data,
      accessToken
    );
  }

  /**
   * Override WABA callback URL with organization-specific endpoint
   */
  async overrideWabaCallbackUrl(organizationId: string): Promise<any> {
    try {
      // Get organization with WhatsApp config
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { metadata: true, slug: true },
      });

      if (!organization?.metadata) {
        throw new Error('Organization not found or missing metadata');
      }

      const metadata = organization.metadata as any;
      const whatsappConfig: WhatsAppConfig = metadata.whatsapp;

      if (!whatsappConfig?.access_token || !whatsappConfig?.waba_id) {
        throw new Error('WhatsApp configuration not found in organization metadata');
      }

      // Construct callback URL using organization slug as identifier
      const callbackUrl = `${process.env.APP_URL}/api/webhook/whatsapp/${organization.slug}`;
      const verifyToken = organization.slug; // Use slug as verify token

      const data = {
        override_callback_uri: callbackUrl,
        verify_token: verifyToken,
      };

      return this.makeGraphApiCall(
        `${whatsappConfig.waba_id}/subscribed_apps`,
        'POST',
        data,
        whatsappConfig.access_token
      );
    } catch (error: any) {
      throw new WhatsAppError(`Failed to override callback URL: ${error.message}`);
    }
  }

  /**
   * Get message templates from WABA
   */
  async getMessageTemplates(wabaId: string, accessToken: string): Promise<any> {
    const params = {
      fields: 'id,name,category,language,status,components,rejected_reason',
      limit: 100,
    };

    return this.makeGraphApiCall(
      `${wabaId}/message_templates`,
      'GET',
      null,
      accessToken,
      params
    );
  }

  /**
   * Create a new message template
   */
  async createTemplate(
    wabaId: string,
    accessToken: string,
    templateData: any
  ): Promise<any> {
    return this.makeGraphApiCall(
      `${wabaId}/message_templates`,
      'POST',
      templateData,
      accessToken
    );
  }

  /**
   * Update an existing message template
   */
  async updateTemplate(
    templateId: string,
    accessToken: string,
    templateData: any
  ): Promise<any> {
    return this.makeGraphApiCall(
      templateId,
      'POST',
      templateData,
      accessToken
    );
  }

  /**
   * Delete a message template
   */
  async deleteTemplate(templateId: string, accessToken: string): Promise<any> {
    return this.makeGraphApiCall(
      templateId,
      'DELETE',
      null,
      accessToken
    );
  }

  /**
   * Send a WhatsApp message
   */
  async sendMessage(
    phoneNumberId: string,
    accessToken: string,
    messageData: any
  ): Promise<any> {
    const data = {
      messaging_product: 'whatsapp',
      ...messageData,
    };

    return this.makeGraphApiCall(
      `${phoneNumberId}/messages`,
      'POST',
      data,
      accessToken
    );
  }

  /**
   * Get media information
   */
  async getMedia(mediaId: string, accessToken: string): Promise<any> {
    return this.makeGraphApiCall(
      mediaId,
      'GET',
      null,
      accessToken
    );
  }

  /**
   * Upload media to WhatsApp
   */
  async uploadMedia(
    phoneNumberId: string,
    accessToken: string,
    mediaData: FormData
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${phoneNumberId}/media`,
        mediaData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const whatsappError: WhatsAppError = new Error(
        error.response?.data?.error?.message || 'Media upload failed'
      );
      whatsappError.code = error.response?.data?.error?.code;
      whatsappError.details = error.response?.data?.error;
      whatsappError.statusCode = error.response?.status;

      throw whatsappError;
    }
  }
}