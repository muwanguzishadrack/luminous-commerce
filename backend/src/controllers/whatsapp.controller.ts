import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { WhatsAppManualSetupService } from '../services/whatsapp-manual-setup.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { MetaService } from '../services/meta.service';
import { 
  ManualSetupCredentials,
  CreateWhatsAppConfigRequest,
  UpdateWhatsAppConfigRequest,
  SendMessageRequest,
  CreateTemplateRequest,
  BusinessProfile,
  MetaWebhookPayload,
  WhatsAppError
} from '../types/whatsapp';
import { successResponse, errorResponse } from '../utils/response';

export class WhatsAppController {
  private manualSetupService: WhatsAppManualSetupService;
  private metaService: MetaService;

  constructor() {
    this.manualSetupService = new WhatsAppManualSetupService();
    this.metaService = new MetaService();
  }

  /**
   * Setup WhatsApp manually with user-provided credentials
   * POST /api/whatsapp/setup/:orgId
   */
  setupManualConfiguration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;
      const credentials: ManualSetupCredentials = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      // Validate required fields
      const required = ['access_token', 'app_id', 'phone_number_id', 'waba_id'];
      const missing = required.filter(field => !credentials[field as keyof ManualSetupCredentials]);
      
      if (missing.length > 0) {
        res.status(400).json(errorResponse(`Missing required fields: ${missing.join(', ')}`));
        return;
      }

      // Setup manual configuration
      const result = await this.manualSetupService.setupManualConfiguration(
        organizationId,
        credentials
      );

      res.json(successResponse('WhatsApp configuration setup successfully', result));

    } catch (error: any) {
      console.error('Manual setup error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to setup WhatsApp configuration'));
    }
  };

  /**
   * Refresh WhatsApp configuration data from Facebook
   * POST /api/whatsapp/settings/:orgId/refresh
   */
  refreshConfiguration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const result = await this.manualSetupService.refreshConfiguration(organizationId);

      res.json(successResponse('Configuration refreshed successfully', result));

    } catch (error: any) {
      console.error('Configuration refresh error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to refresh configuration'));
    }
  };

  /**
   * Update access token only
   * POST /api/whatsapp/settings/:orgId/token
   */
  updateAccessToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;
      const { access_token } = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      if (!access_token) {
        res.status(400).json(errorResponse('Access token required'));
        return;
      }

      const result = await this.manualSetupService.updateAccessToken(organizationId, access_token);

      res.json(successResponse('Access token updated successfully', result));

    } catch (error: any) {
      console.error('Access token update error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to update access token'));
    }
  };

  /**
   * Get webhook configuration for organization
   * GET /api/whatsapp/webhook-config/:orgId
   */
  getWebhookConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const result = await this.manualSetupService.getWebhookConfig(organizationId);

      res.json(successResponse('Webhook configuration retrieved', result));

    } catch (error: any) {
      console.error('Webhook config error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to get webhook configuration'));
    }
  };

  /**
   * Get WhatsApp configuration for organization
   * GET /api/whatsapp/settings/:orgId
   */
  getWhatsAppSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const config = await whatsappService.getWhatsAppConfig();
      
      if (!config) {
        res.status(404).json(errorResponse('WhatsApp configuration not found'));
        return;
      }

      // Remove sensitive data from response
      const publicConfig = {
        is_embedded_signup: config.is_embedded_signup,
        app_id: config.app_id,
        waba_id: config.waba_id,
        phone_number_id: config.phone_number_id,
        display_phone_number: config.display_phone_number,
        verified_name: config.verified_name,
        quality_rating: config.quality_rating,
        name_status: config.name_status,
        messaging_limit_tier: config.messaging_limit_tier,
        account_review_status: config.account_review_status,
        business_profile: config.business_profile,
      };

      res.json(successResponse('WhatsApp settings retrieved', publicConfig));

    } catch (error: any) {
      console.error('Get settings error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to get settings'));
    }
  };

  /**
   * Update WhatsApp configuration
   * PUT /api/whatsapp/settings/:orgId
   */
  updateWhatsAppSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;
      const updates: UpdateWhatsAppConfigRequest = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      await whatsappService.updateWhatsAppConfig(updates);

      res.json(successResponse('WhatsApp settings updated successfully'));

    } catch (error: any) {
      console.error('Update settings error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to update settings'));
    }
  };

  /**
   * Get account status and health
   * GET /api/whatsapp/status/:orgId
   */
  getAccountStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const status = await whatsappService.getAccountStatus();
      res.json(successResponse('Account status retrieved', status));

    } catch (error: any) {
      console.error('Get status error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to get account status'));
    }
  };

  /**
   * Validate WhatsApp configuration
   * GET /api/whatsapp/validate/:orgId
   */
  validateConfiguration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const validation = await whatsappService.validateConfiguration();
      res.json(successResponse('Configuration validated', validation));

    } catch (error: any) {
      console.error('Validation error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to validate configuration'));
    }
  };

  /**
   * Get business profile
   * GET /api/whatsapp/business-profile/:orgId
   */
  getBusinessProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const profile = await whatsappService.getBusinessProfile();

      res.json(successResponse('Business profile retrieved', profile));

    } catch (error: any) {
      console.error('Get business profile error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to get business profile'));
    }
  };

  /**
   * Update business profile
   * POST /api/whatsapp/business-profile/:orgId
   */
  updateBusinessProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;
      const profileUpdates: Partial<BusinessProfile> = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const result = await whatsappService.updateBusinessProfile(profileUpdates);

      res.json(successResponse('Business profile updated successfully', result));

    } catch (error: any) {
      console.error('Update business profile error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to update business profile'));
    }
  };

  /**
   * Send WhatsApp message
   * POST /api/whatsapp/send
   */
  sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.organization?.id;
      const userId = req.user?.userId;
      const messageRequest: SendMessageRequest = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const result = await whatsappService.sendMessage(messageRequest, userId);

      res.json(successResponse('Message sent successfully', result));

    } catch (error: any) {
      console.error('Send message error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to send message'));
    }
  };

  /**
   * Send template message
   * POST /api/whatsapp/send/template
   */
  sendTemplateMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.organization?.id;
      const userId = req.user?.userId;
      const { to, templateName, languageCode, components } = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const result = await whatsappService.sendTemplateMessage(
        to,
        templateName,
        languageCode,
        components,
        userId
      );

      res.json(successResponse('Template message sent successfully', result));

    } catch (error: any) {
      console.error('Send template message error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to send template message'));
    }
  };

  /**
   * Send media message
   * POST /api/whatsapp/send/media
   */
  sendMediaMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.organization?.id;
      const userId = req.user?.userId;
      const { to, mediaType, mediaUrl, caption, filename } = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const result = await whatsappService.sendMediaMessage(
        to,
        mediaType,
        mediaUrl,
        caption,
        filename,
        userId
      );

      res.json(successResponse('Media message sent successfully', result));

    } catch (error: any) {
      console.error('Send media message error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to send media message'));
    }
  };

  /**
   * Get templates
   * GET /api/whatsapp/templates/:orgId
   */
  getTemplates = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const templates = await whatsappService.getTemplates();

      res.json(successResponse('Templates retrieved', templates));

    } catch (error: any) {
      console.error('Get templates error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to get templates'));
    }
  };

  /**
   * Create template
   * POST /api/whatsapp/templates/:orgId
   */
  createTemplate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;
      const templateData: CreateTemplateRequest = req.body;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const result = await whatsappService.createTemplate(templateData);

      res.json(successResponse('Template created successfully', result));

    } catch (error: any) {
      console.error('Create template error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to create template'));
    }
  };

  /**
   * Sync templates from Facebook
   * POST /api/whatsapp/templates/:orgId/sync
   */
  syncTemplates = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.orgId || req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      await whatsappService.syncTemplates();

      res.json(successResponse('Templates synced successfully'));

    } catch (error: any) {
      console.error('Sync templates error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to sync templates'));
    }
  };

  /**
   * Get conversation messages
   * GET /api/whatsapp/conversations/:conversationId/messages
   */
  getConversationMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.organization?.id;
      const { conversationId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      const whatsappService = new WhatsAppService(organizationId);
      const messages = await whatsappService.getConversationMessages(conversationId, limit);

      res.json(successResponse('Messages retrieved', messages));

    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to get messages'));
    }
  };

  /**
   * Upload media
   * POST /api/whatsapp/media/upload
   */
  uploadMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      // Handle multipart form data
      const mediaData = req.body as FormData;

      const whatsappService = new WhatsAppService(organizationId);
      const result = await whatsappService.uploadMedia(mediaData);

      res.json(successResponse('Media uploaded successfully', result));

    } catch (error: any) {
      console.error('Upload media error:', error);
      res.status(500).json(errorResponse(error.message || 'Failed to upload media'));
    }
  };

  /**
   * Handle incoming webhooks from WhatsApp
   * GET/POST /api/webhook/whatsapp/:orgIdentifier
   */
  handleWebhook = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { orgIdentifier } = req.params;

      if (req.method === 'GET') {
        // Webhook verification
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === orgIdentifier) {
          console.log('Webhook verified for organization:', orgIdentifier);
          res.status(200).send(challenge);
          return;
        }

        res.status(403).send('Forbidden');
        return;
      }

      if (req.method === 'POST') {
        // Handle webhook events
        const webhookData: MetaWebhookPayload = req.body;

        // Process webhook events
        await this.processWebhookEvents(webhookData, orgIdentifier);

        res.status(200).send('OK');
        return;
      }

      res.status(405).send('Method Not Allowed');

    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json(errorResponse(error.message || 'Webhook processing failed'));
    }
  };

  /**
   * Global webhook verification endpoint
   * GET /api/webhook/waba
   */
  verifyGlobalWebhook = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

      if (mode === 'subscribe' && token === verifyToken) {
        console.log('Global webhook verified');
        res.status(200).send(challenge);
        return;
      }

      res.status(403).send('Forbidden');

    } catch (error: any) {
      console.error('Global webhook verification error:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
   * Process webhook events from WhatsApp
   */
  private async processWebhookEvents(
    webhookData: MetaWebhookPayload,
    orgIdentifier: string
  ): Promise<void> {
    try {
      // Find organization by identifier (slug)
      // This would need to be implemented based on your organization lookup logic
      
      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          const { value } = change;

          // Process incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              await this.processIncomingMessage(message, value.metadata, orgIdentifier);
            }
          }

          // Process message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await this.processMessageStatus(status, orgIdentifier);
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Webhook processing error:', error);
    }
  }

  /**
   * Process incoming message from webhook
   */
  private async processIncomingMessage(
    message: any,
    metadata: any,
    orgIdentifier: string
  ): Promise<void> {
    try {
      // Implementation would depend on your organization lookup and message processing logic
      console.log('Processing incoming message:', message);

      // Store incoming message in database
      // Update contact information
      // Trigger auto-replies if configured
      // Send real-time updates to frontend

    } catch (error: any) {
      console.error('Failed to process incoming message:', error);
    }
  }

  /**
   * Process message status update from webhook
   */
  private async processMessageStatus(
    status: any,
    orgIdentifier: string
  ): Promise<void> {
    try {
      console.log('Processing message status:', status);

      // Update message status in database
      // Send real-time updates to frontend

    } catch (error: any) {
      console.error('Failed to process message status:', error);
    }
  }
}