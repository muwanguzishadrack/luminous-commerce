import { PrismaClient } from '@prisma/client';
import { MetaService } from './meta.service';
import { 
  WhatsAppConfig,
  SendMessageRequest,
  MessageContent,
  TextMessageContent,
  MediaMessageContent,
  TemplateMessageContent,
  InteractiveMessageContent,
  LocationMessageContent,
  ContactMessageContent,
  BusinessProfile,
  CreateTemplateRequest,
  WhatsAppError,
  MessageType,
  MessageDirection,
  MessageStatus
} from '../types/whatsapp';

const prisma = new PrismaClient();

export class WhatsAppService {
  private metaService: MetaService;
  private organizationId: string;
  private config: WhatsAppConfig | null = null;

  constructor(organizationId: string) {
    this.metaService = new MetaService();
    this.organizationId = organizationId;
  }

  /**
   * Initialize service with WhatsApp configuration
   */
  private async initializeConfig(): Promise<void> {
    if (!this.config) {
      this.config = await this.getWhatsAppConfig();
      if (!this.config) {
        throw new Error('WhatsApp configuration not found for organization');
      }
    }
  }

  /**
   * Get WhatsApp configuration for organization
   */
  async getWhatsAppConfig(): Promise<WhatsAppConfig | null> {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id: this.organizationId },
        select: { metadata: true }
      });

      if (!organization?.metadata || !(organization.metadata as any).whatsapp) {
        return null;
      }

      return (organization.metadata as any).whatsapp as WhatsAppConfig;

    } catch (error) {
      console.error('Failed to get WhatsApp configuration:', error);
      return null;
    }
  }

  /**
   * Update WhatsApp configuration
   */
  async updateWhatsAppConfig(updates: Partial<WhatsAppConfig>): Promise<void> {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id: this.organizationId },
        select: { metadata: true }
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      const currentMetadata = organization.metadata as any || {};
      const currentWhatsAppConfig = currentMetadata.whatsapp || {};
      
      const updatedMetadata = {
        ...currentMetadata,
        whatsapp: {
          ...currentWhatsAppConfig,
          ...updates
        }
      };

      await prisma.organization.update({
        where: { id: this.organizationId },
        data: { metadata: updatedMetadata }
      });

      // Reset config so it gets reloaded next time
      this.config = null;

    } catch (error) {
      console.error('Failed to update WhatsApp configuration:', error);
      throw error;
    }
  }

  /**
   * Get account status
   */
  async getAccountStatus(): Promise<any> {
    try {
      await this.initializeConfig();
      
      if (!this.config?.access_token || !this.config?.waba_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      // Get account review status
      const accountStatus = await this.metaService.makeGraphApiCall(
        this.config.waba_id,
        'GET',
        null,
        this.config.access_token,
        { fields: 'account_review_status' }
      );

      // Get phone number status if available
      let phoneStatus = null;
      if (this.config.phone_number_id) {
        phoneStatus = await this.metaService.makeGraphApiCall(
          this.config.phone_number_id,
          'GET',
          null,
          this.config.access_token,
          { fields: 'status,code_verification_status,quality_rating' }
        );
      }

      return {
        account_review_status: accountStatus.account_review_status,
        phone_status: phoneStatus,
        waba_id: this.config.waba_id,
        phone_number_id: this.config.phone_number_id,
        display_phone_number: this.config.display_phone_number
      };

    } catch (error) {
      console.error('Failed to get account status:', error);
      throw error;
    }
  }

  /**
   * Validate configuration
   */
  async validateConfiguration(): Promise<any> {
    try {
      await this.initializeConfig();
      
      if (!this.config) {
        return {
          valid: false,
          errors: ['WhatsApp configuration not found'],
          warnings: []
        };
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      // Check required fields
      if (!this.config.access_token) errors.push('Access token is missing');
      if (!this.config.app_id) errors.push('App ID is missing');
      if (!this.config.phone_number_id) errors.push('Phone Number ID is missing');
      if (!this.config.waba_id) errors.push('WABA ID is missing');

      // Check account status
      if (this.config.account_review_status === 'PENDING') {
        warnings.push('Account review is pending with Meta');
      }

      if (this.config.quality_rating === 'RED') {
        warnings.push('Phone number quality rating is RED - messaging may be limited');
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        config: {
          is_configured: errors.length === 0,
          account_status: this.config.account_review_status,
          quality_rating: this.config.quality_rating,
          phone_number: this.config.display_phone_number
        }
      };

    } catch (error) {
      console.error('Failed to validate configuration:', error);
      return {
        valid: false,
        errors: ['Failed to validate configuration: ' + (error as Error).message],
        warnings: []
      };
    }
  }

  /**
   * Send a WhatsApp message
   */
  async sendMessage(request: SendMessageRequest, userId?: string): Promise<any> {
    try {
      await this.initializeConfig();
      
      if (!this.config?.access_token || !this.config?.phone_number_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      // Prepare message data based on type
      const messageData = this.prepareMessageData(request);

      // Send message via Graph API
      const response = await this.metaService.sendMessage(
        this.config.phone_number_id,
        this.config.access_token,
        messageData
      );

      // Store message in database
      const messageRecord = await this.storeMessage({
        wamId: response.messages?.[0]?.id,
        conversationId: request.conversationId || `conv_${Date.now()}`,
        type: request.type,
        content: request.content,
        direction: MessageDirection.OUTBOUND,
        status: MessageStatus.SENT,
        userId: userId,
        recipientPhone: request.to,
      });

      return {
        success: true,
        messageId: response.messages?.[0]?.id,
        databaseId: messageRecord.id,
        response,
      };

    } catch (error: any) {
      throw new WhatsAppError(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Send a template message
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string,
    components?: any[],
    userId?: string
  ): Promise<any> {
    const templateContent: TemplateMessageContent = {
      name: templateName,
      language: { code: languageCode },
      components: components || [],
    };

    return this.sendMessage({
      to,
      type: MessageType.TEMPLATE,
      content: templateContent,
    }, userId);
  }

  /**
   * Send media message
   */
  async sendMediaMessage(
    to: string,
    mediaType: 'image' | 'video' | 'audio' | 'document',
    mediaUrl: string,
    caption?: string,
    filename?: string,
    userId?: string
  ): Promise<any> {
    const mediaContent: MediaMessageContent = {
      type: mediaType,
      url: mediaUrl,
      caption,
      filename,
    };

    const messageType = mediaType.toUpperCase() as MessageType;

    return this.sendMessage({
      to,
      type: messageType,
      content: mediaContent,
    }, userId);
  }

  /**
   * Send interactive message (buttons/list)
   */
  async sendInteractiveMessage(
    to: string,
    interactiveContent: InteractiveMessageContent,
    userId?: string
  ): Promise<any> {
    return this.sendMessage({
      to,
      type: MessageType.INTERACTIVE,
      content: interactiveContent,
    }, userId);
  }

  /**
   * Send location message
   */
  async sendLocationMessage(
    to: string,
    latitude: number,
    longitude: number,
    name?: string,
    address?: string,
    userId?: string
  ): Promise<any> {
    const locationContent: LocationMessageContent = {
      latitude,
      longitude,
      name,
      address,
    };

    return this.sendMessage({
      to,
      type: MessageType.LOCATION,
      content: locationContent,
    }, userId);
  }

  /**
   * Send contact message
   */
  async sendContactMessage(
    to: string,
    contactContent: ContactMessageContent,
    userId?: string
  ): Promise<any> {
    return this.sendMessage({
      to,
      type: MessageType.CONTACT,
      content: contactContent,
    }, userId);
  }

  /**
   * React to a message
   */
  async reactToMessage(
    messageId: string,
    emoji: string,
    userId?: string
  ): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token || !this.config?.phone_number_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      const messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: messageId, // This should be the recipient phone number
        type: 'reaction',
        reaction: {
          message_id: messageId,
          emoji: emoji,
        },
      };

      const response = await this.metaService.sendMessage(
        this.config.phone_number_id,
        this.config.access_token,
        messageData
      );

      return {
        success: true,
        response,
      };

    } catch (error: any) {
      throw new WhatsAppError(`Failed to react to message: ${error.message}`);
    }
  }

  /**
   * Get business profile
   */
  async getBusinessProfile(): Promise<BusinessProfile> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token || !this.config?.phone_number_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      const response = await this.metaService.getBusinessProfile(
        this.config.phone_number_id,
        this.config.access_token
      );

      return response.data?.[0] || {};

    } catch (error: any) {
      throw new WhatsAppError(`Failed to get business profile: ${error.message}`);
    }
  }

  /**
   * Update business profile
   */
  async updateBusinessProfile(profile: Partial<BusinessProfile>): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token || !this.config?.phone_number_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      const response = await this.metaService.updateBusinessProfile(
        this.config.phone_number_id,
        this.config.access_token,
        profile
      );

      // Update stored business profile in metadata
      if (this.config.business_profile) {
        const updatedBusinessProfile = { ...this.config.business_profile, ...profile };
        await this.updateWhatsAppConfig({
          business_profile: updatedBusinessProfile,
        });
      }

      return response;

    } catch (error: any) {
      throw new WhatsAppError(`Failed to update business profile: ${error.message}`);
    }
  }

  /**
   * Create a new message template
   */
  async createTemplate(templateData: CreateTemplateRequest): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token || !this.config?.waba_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      const response = await this.metaService.createTemplate(
        this.config.waba_id,
        this.config.access_token,
        templateData
      );

      // Store template in local database
      if (response.id) {
        await prisma.whatsAppTemplate.create({
          data: {
            organizationId: this.organizationId,
            metaId: response.id,
            name: templateData.name,
            language: templateData.language,
            category: templateData.category,
            status: 'PENDING',
            metadata: { ...templateData, meta_response: response } as any,
          },
        });
      }

      return response;

    } catch (error: any) {
      throw new WhatsAppError(`Failed to create template: ${error.message}`);
    }
  }

  /**
   * Update an existing template
   */
  async updateTemplate(templateId: string, templateData: any): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token) {
        throw new Error('WhatsApp configuration incomplete');
      }

      const response = await this.metaService.updateTemplate(
        templateId,
        this.config.access_token,
        templateData
      );

      // Update local database record
      await prisma.whatsAppTemplate.updateMany({
        where: {
          organizationId: this.organizationId,
          metaId: templateId,
        },
        data: {
          metadata: { ...templateData, meta_response: response },
          status: 'PENDING', // Reset status as it needs re-approval
        },
      });

      return response;

    } catch (error: any) {
      throw new WhatsAppError(`Failed to update template: ${error.message}`);
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token) {
        throw new Error('WhatsApp configuration incomplete');
      }

      const response = await this.metaService.deleteTemplate(
        templateId,
        this.config.access_token
      );

      // Remove from local database
      await prisma.whatsAppTemplate.deleteMany({
        where: {
          organizationId: this.organizationId,
          metaId: templateId,
        },
      });

      return response;

    } catch (error: any) {
      throw new WhatsAppError(`Failed to delete template: ${error.message}`);
    }
  }

  /**
   * Sync templates from Facebook
   */
  async syncTemplates(): Promise<void> {
    try {
      await this.initializeConfig();
      
      if (!this.config?.access_token || !this.config?.waba_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      // Get templates from Facebook
      const response = await this.metaService.makeGraphApiCall(
        `${this.config.waba_id}/message_templates`,
        'GET',
        null,
        this.config.access_token,
        { fields: 'id,name,category,language,status,components' }
      );

      // Delete existing templates for this organization
      await prisma.whatsAppTemplate.deleteMany({
        where: { organizationId: this.organizationId }
      });

      // Store new templates
      if (response.data && response.data.length > 0) {
        const templates = response.data.map((template: any) => ({
          organizationId: this.organizationId,
          metaId: template.id,
          name: template.name,
          category: template.category?.toUpperCase() || 'UTILITY',
          language: template.language || 'en',
          status: template.status?.toUpperCase() || 'PENDING',
          metadata: template
        }));

        await prisma.whatsAppTemplate.createMany({
          data: templates
        });
      }

    } catch (error) {
      console.error('Failed to sync templates:', error);
      throw error;
    }
  }

  /**
   * Get templates from local database
   */
  async getTemplates(): Promise<any[]> {
    return prisma.whatsAppTemplate.findMany({
      where: { organizationId: this.organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(conversationId: string, limit = 50): Promise<any[]> {
    return prisma.whatsAppMessage.findMany({
      where: {
        organizationId: this.organizationId,
        conversationId,
      },
      include: {
        contact: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get or create contact by phone number
   */
  async getOrCreateContact(phone: string, contactData?: any): Promise<any> {
    const existingContact = await prisma.whatsAppContact.findFirst({
      where: {
        organizationId: this.organizationId,
        phone,
      },
    });

    if (existingContact) {
      return existingContact;
    }

    // Create new contact
    return prisma.whatsAppContact.create({
      data: {
        organizationId: this.organizationId,
        phone,
        firstName: contactData?.firstName,
        lastName: contactData?.lastName,
        email: contactData?.email,
        ...contactData,
      },
    });
  }

  /**
   * Upload media to WhatsApp
   */
  async uploadMedia(mediaData: FormData): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token || !this.config?.phone_number_id) {
        throw new Error('WhatsApp configuration incomplete');
      }

      return this.metaService.uploadMedia(
        this.config.phone_number_id,
        this.config.access_token,
        mediaData
      );

    } catch (error: any) {
      throw new WhatsAppError(`Failed to upload media: ${error.message}`);
    }
  }

  /**
   * Get media information
   */
  async getMedia(mediaId: string): Promise<any> {
    try {
      await this.initializeConfig();

      if (!this.config?.access_token) {
        throw new Error('WhatsApp configuration incomplete');
      }

      return this.metaService.getMedia(mediaId, this.config.access_token);

    } catch (error: any) {
      throw new WhatsAppError(`Failed to get media: ${error.message}`);
    }
  }

  /**
   * Prepare message data for Graph API
   */
  private prepareMessageData(request: SendMessageRequest): any {
    const baseData = {
      recipient_type: 'individual',
      to: request.to,
      type: request.type.toLowerCase(),
    };

    switch (request.type) {
      case MessageType.TEXT:
        const textContent = request.content as TextMessageContent;
        return {
          ...baseData,
          text: {
            body: textContent.body,
            preview_url: textContent.preview_url || false,
          },
        };

      case MessageType.TEMPLATE:
        const templateContent = request.content as TemplateMessageContent;
        return {
          ...baseData,
          template: templateContent,
        };

      case MessageType.IMAGE:
      case MessageType.VIDEO:
      case MessageType.AUDIO:
      case MessageType.DOCUMENT:
        const mediaContent = request.content as MediaMessageContent;
        const mediaType = request.type.toLowerCase();
        return {
          ...baseData,
          [mediaType]: {
            link: mediaContent.url,
            id: mediaContent.id,
            caption: mediaContent.caption,
            filename: mediaContent.filename,
          },
        };

      case MessageType.LOCATION:
        const locationContent = request.content as LocationMessageContent;
        return {
          ...baseData,
          location: locationContent,
        };

      case MessageType.CONTACT:
        const contactContent = request.content as ContactMessageContent;
        return {
          ...baseData,
          contacts: [contactContent],
        };

      case MessageType.INTERACTIVE:
        const interactiveContent = request.content as InteractiveMessageContent;
        return {
          ...baseData,
          interactive: interactiveContent,
        };

      default:
        throw new Error(`Unsupported message type: ${request.type}`);
    }
  }

  /**
   * Store message in database
   */
  private async storeMessage(messageData: {
    wamId?: string;
    conversationId: string;
    type: MessageType;
    content: MessageContent;
    direction: MessageDirection;
    status: MessageStatus;
    userId?: string;
    recipientPhone?: string;
    contactId?: string;
  }): Promise<any> {
    try {
      // Get or create contact if recipient phone is provided
      let contactId = messageData.contactId;
      if (messageData.recipientPhone && !contactId) {
        const contact = await this.getOrCreateContact(messageData.recipientPhone);
        contactId = contact.id;
      }

      return prisma.whatsAppMessage.create({
        data: {
          organizationId: this.organizationId,
          wamId: messageData.wamId,
          conversationId: messageData.conversationId,
          contactId: contactId,
          type: messageData.type,
          metadata: {
            content: messageData.content,
            direction: messageData.direction,
            timestamp: new Date().toISOString(),
          } as any,
          direction: messageData.direction,
          status: messageData.status,
          userId: messageData.userId,
          timestamp: new Date(),
        },
      });

    } catch (error: any) {
      console.error('Failed to store message:', error);
      throw new Error(`Failed to store message: ${error.message}`);
    }
  }
}