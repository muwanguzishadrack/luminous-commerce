import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { EmbeddedSignupService } from '../services/embedded-signup.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { MetaService } from '../services/meta.service';
import { 
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
  private embeddedSignupService: EmbeddedSignupService;
  private metaService: MetaService;

  constructor() {
    this.embeddedSignupService = new EmbeddedSignupService();
    this.metaService = new MetaService();
  }

  /**
   * Handle OAuth exchange code from Meta embedded signup
   * GET/POST /api/whatsapp/exchange-code
   */
  handleEmbeddedSignup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { code, state } = req.query;
      const organizationId = req.organization?.id;

      if (!organizationId) {
        res.status(400).json(errorResponse('Organization ID required'));
        return;
      }

      if (!code) {
        res.status(400).json(errorResponse('Authorization code required'));
        return;
      }

      // Handle the complete embedded signup flow
      const result = await this.embeddedSignupService.handleSignupFlow(
        code as string,
        organizationId
      );

      if (result.success) {
        res.json(successResponse('WhatsApp embedded signup completed successfully', result.data));
      } else {
        res.status(400).json(errorResponse(result.error || 'Signup failed'));
      }

    } catch (error: any) {
      console.error('Embedded signup error:', error);
      res.status(500).json(errorResponse(error.message || 'Internal server error'));
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

      const config = await this.embeddedSignupService.getWhatsAppConfig(organizationId);
      
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

      await this.embeddedSignupService.updateWhatsAppConfig(organizationId, updates);

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

      const status = await this.embeddedSignupService.getAccountStatus(organizationId);
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

      const validation = await this.embeddedSignupService.validateConfig(organizationId);
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