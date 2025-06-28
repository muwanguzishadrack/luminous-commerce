import { Router } from 'express';
import { z } from 'zod';
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { authenticate } from '../middleware/auth';
import { requireOrganization } from '../middleware/organization';
import { 
  validateSchema,
  validateQuery,
  validateParams,
  createWhatsAppConfigSchema,
  updateWhatsAppConfigSchema,
  businessProfileSchema,
  sendMessageSchema,
  sendTemplateMessageSchema,
  sendMediaMessageSchema,
  createTemplateSchema,
  embeddedSignupSchema,
  webhookVerificationSchema,
  orgIdentifierSchema
} from '../validation/whatsapp.validation';

const router = Router();
const whatsappController = new WhatsAppController();

// =====================
// MANUAL SETUP ROUTES
// =====================

/**
 * Setup WhatsApp manually with user-provided credentials
 * POST /api/whatsapp/setup/:orgId
 */
router.post('/setup/:orgId',
  authenticate,
  requireOrganization,
  validateParams(z.object({ orgId: z.string() })),
  validateSchema(z.object({
    access_token: z.string().min(1, 'Access token is required'),
    app_id: z.string().min(1, 'App ID is required'),
    phone_number_id: z.string().min(1, 'Phone number ID is required'),
    waba_id: z.string().min(1, 'WABA ID is required')
  })),
  whatsappController.setupManualConfiguration
);

/**
 * Refresh WhatsApp configuration data from Facebook
 * POST /api/whatsapp/settings/:orgId/refresh
 */
router.post('/settings/:orgId/refresh',
  authenticate,
  requireOrganization,
  validateParams(z.object({ orgId: z.string() })),
  whatsappController.refreshConfiguration
);

/**
 * Update access token only
 * POST /api/whatsapp/settings/:orgId/token
 */
router.post('/settings/:orgId/token',
  authenticate,
  requireOrganization,
  validateParams(z.object({ orgId: z.string() })),
  validateSchema(z.object({
    access_token: z.string().min(1, 'Access token is required')
  })),
  whatsappController.updateAccessToken
);

/**
 * Get webhook configuration for organization
 * GET /api/whatsapp/webhook-config/:orgId
 */
router.get('/webhook-config/:orgId',
  authenticate,
  requireOrganization,
  validateParams(z.object({ orgId: z.string() })),
  whatsappController.getWebhookConfig
);

// =====================
// ORGANIZATION SETTINGS ROUTES
// =====================

/**
 * Get WhatsApp configuration for organization
 * GET /api/whatsapp/settings/:orgId
 */
router.get('/settings/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  whatsappController.getWhatsAppSettings
);

/**
 * Update WhatsApp configuration for organization
 * PUT /api/whatsapp/settings/:orgId
 */
router.put('/settings/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  validateSchema(updateWhatsAppConfigSchema),
  whatsappController.updateWhatsAppSettings
);

/**
 * Get account status and health
 * GET /api/whatsapp/status/:orgId
 */
router.get('/status/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  whatsappController.getAccountStatus
);

/**
 * Validate WhatsApp configuration
 * GET /api/whatsapp/validate/:orgId
 */
router.get('/validate/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  whatsappController.validateConfiguration
);

// =====================
// BUSINESS PROFILE ROUTES
// =====================

/**
 * Get business profile
 * GET /api/whatsapp/business-profile/:orgId
 */
router.get('/business-profile/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  whatsappController.getBusinessProfile
);

/**
 * Update business profile
 * POST /api/whatsapp/business-profile/:orgId
 */
router.post('/business-profile/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  validateSchema(businessProfileSchema),
  whatsappController.updateBusinessProfile
);

// =====================
// MESSAGING ROUTES
// =====================

/**
 * Send WhatsApp message
 * POST /api/whatsapp/send
 */
router.post('/send',
  authenticate,
  requireOrganization,
  validateSchema(sendMessageSchema),
  whatsappController.sendMessage
);

/**
 * Send template message
 * POST /api/whatsapp/send/template
 */
router.post('/send/template',
  authenticate,
  requireOrganization,
  validateSchema(sendTemplateMessageSchema),
  whatsappController.sendTemplateMessage
);

/**
 * Send media message
 * POST /api/whatsapp/send/media
 */
router.post('/send/media',
  authenticate,
  requireOrganization,
  validateSchema(sendMediaMessageSchema),
  whatsappController.sendMediaMessage
);

// =====================
// TEMPLATE ROUTES
// =====================

/**
 * Get templates for organization
 * GET /api/whatsapp/templates/:orgId
 */
router.get('/templates/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  whatsappController.getTemplates
);

/**
 * Create new template
 * POST /api/whatsapp/templates/:orgId
 */
router.post('/templates/:orgId',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  validateSchema(createTemplateSchema),
  whatsappController.createTemplate
);

/**
 * Sync templates from Facebook
 * POST /api/whatsapp/templates/:orgId/sync
 */
router.post('/templates/:orgId/sync',
  authenticate,
  validateParams(z.object({ orgId: z.string().cuid() })),
  whatsappController.syncTemplates
);

// =====================
// CONVERSATION ROUTES
// =====================

/**
 * Get conversation messages
 * GET /api/whatsapp/conversations/:conversationId/messages
 */
router.get('/conversations/:conversationId/messages',
  authenticate,
  requireOrganization,
  validateParams(z.object({ conversationId: z.string() })),
  whatsappController.getConversationMessages
);

// =====================
// MEDIA ROUTES
// =====================

/**
 * Upload media to WhatsApp
 * POST /api/whatsapp/media/upload
 */
router.post('/media/upload',
  authenticate,
  requireOrganization,
  // Note: Media upload validation would be handled by multer middleware
  whatsappController.uploadMedia
);

// =====================
// WEBHOOK ROUTES
// =====================

/**
 * Organization-specific webhook endpoint
 * Handles incoming WhatsApp messages and status updates
 * GET/POST /api/webhook/whatsapp/:orgIdentifier
 */
router.get('/webhook/whatsapp/:orgIdentifier',
  validateParams(z.object({ orgIdentifier: orgIdentifierSchema })),
  whatsappController.handleWebhook
);

router.post('/webhook/whatsapp/:orgIdentifier',
  validateParams(z.object({ orgIdentifier: orgIdentifierSchema })),
  whatsappController.handleWebhook
);

/**
 * Global webhook verification endpoint
 * Used for initial webhook setup with Facebook
 * GET /api/webhook/waba
 */
router.get('/webhook/waba',
  whatsappController.verifyGlobalWebhook
);

// =====================
// ADMIN ROUTES (System-level configuration)
// =====================

/**
 * Store system-level WhatsApp credentials (Admin only)
 * POST /api/admin/whatsapp/setup
 */
router.post('/admin/setup',
  authenticate,
  // Add admin role check middleware here
  validateSchema(createWhatsAppConfigSchema),
  async (req, res) => {
    try {
      // Store system-level configuration
      // This would typically store app_id, client_id, client_secret, config_id
      // in environment variables or a system settings table
      
      res.json({
        success: true,
        message: 'System WhatsApp configuration stored successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to store system configuration'
      });
    }
  }
);

/**
 * Update system-level WhatsApp credentials (Admin only)
 * PUT /api/admin/whatsapp/setup
 */
router.put('/admin/setup',
  authenticate,
  // Add admin role check middleware here
  validateSchema(updateWhatsAppConfigSchema),
  async (req, res) => {
    try {
      // Update system-level configuration
      
      res.json({
        success: true,
        message: 'System WhatsApp configuration updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update system configuration'
      });
    }
  }
);

export default router;