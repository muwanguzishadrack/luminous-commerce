import { z } from 'zod';
import { MessageType, TemplateCategory } from '../types/whatsapp';

// Phone number validation (international format)
const phoneNumberSchema = z.string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Use international format starting with +');

// WhatsApp configuration validation
export const createWhatsAppConfigSchema = z.object({
  app_id: z.string().min(1, 'App ID is required'),
  client_id: z.string().min(1, 'Client ID is required'),
  client_secret: z.string().min(1, 'Client secret is required'),
  config_id: z.string().min(1, 'Config ID is required'),
  access_token: z.string().optional(),
  waba_id: z.string().optional(),
  phone_number_id: z.string().optional(),
  display_phone_number: phoneNumberSchema.optional(),
  verified_name: z.string().optional(),
  business_profile: z.object({
    about: z.string().max(139).optional(),
    address: z.string().max(256).optional(),
    description: z.string().max(512).optional(),
    email: z.string().email().optional(),
    profile_picture_url: z.string().url().optional(),
    websites: z.array(z.string().url()).optional(),
    vertical: z.string().optional(),
  }).optional(),
});

export const updateWhatsAppConfigSchema = z.object({
  app_id: z.string().min(1).optional(),
  client_id: z.string().min(1).optional(),
  client_secret: z.string().min(1).optional(),
  config_id: z.string().min(1).optional(),
  access_token: z.string().optional(),
  waba_id: z.string().optional(),
  phone_number_id: z.string().optional(),
  display_phone_number: phoneNumberSchema.optional(),
  verified_name: z.string().optional(),
  quality_rating: z.string().optional(),
  business_profile: z.object({
    about: z.string().max(139).optional(),
    address: z.string().max(256).optional(),
    description: z.string().max(512).optional(),
    email: z.string().email().optional(),
    profile_picture_url: z.string().url().optional(),
    websites: z.array(z.string().url()).optional(),
    vertical: z.string().optional(),
  }).optional(),
  is_embedded_signup: z.boolean().optional(),
});

// Business profile validation
export const businessProfileSchema = z.object({
  about: z.string().max(139, 'About must be 139 characters or less').optional(),
  address: z.string().max(256, 'Address must be 256 characters or less').optional(),
  description: z.string().max(512, 'Description must be 512 characters or less').optional(),
  email: z.string().email('Invalid email format').optional(),
  profile_picture_url: z.string().url('Invalid URL format').optional(),
  websites: z.array(z.string().url('Invalid website URL')).max(2, 'Maximum 2 websites allowed').optional(),
  vertical: z.enum([
    'UNDEFINED',
    'OTHER',
    'AUTO',
    'BEAUTY',
    'APPAREL',
    'EDU',
    'ENTERTAIN',
    'EVENT_PLAN',
    'FINANCE',
    'GROCERY',
    'GOVT',
    'HOTEL',
    'HEALTH',
    'NONPROFIT',
    'PROF_SERVICES',
    'RETAIL',
    'TRAVEL',
    'RESTAURANT',
    'NOT_A_BIZ'
  ]).optional(),
});

// Message validation schemas
export const textMessageSchema = z.object({
  body: z.string().min(1, 'Message body is required').max(4096, 'Message too long'),
  preview_url: z.boolean().optional(),
});

export const mediaMessageSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'document']),
  url: z.string().url('Invalid media URL').optional(),
  id: z.string().optional(),
  caption: z.string().max(1024, 'Caption too long').optional(),
  filename: z.string().optional(),
}).refine(data => data.url || data.id, {
  message: 'Either media URL or media ID is required'
});

export const locationMessageSchema = z.object({
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  name: z.string().max(1000).optional(),
  address: z.string().max(1000).optional(),
});

export const contactMessageSchema = z.object({
  addresses: z.array(z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    country_code: z.string().optional(),
    type: z.enum(['HOME', 'WORK']).optional(),
  })).optional(),
  birthday: z.string().optional(), // YYYY-MM-DD format
  emails: z.array(z.object({
    email: z.string().email().optional(),
    type: z.enum(['HOME', 'WORK']).optional(),
  })).optional(),
  name: z.object({
    formatted_name: z.string().min(1, 'Formatted name is required'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    middle_name: z.string().optional(),
    suffix: z.string().optional(),
    prefix: z.string().optional(),
  }),
  org: z.object({
    company: z.string().optional(),
    department: z.string().optional(),
    title: z.string().optional(),
  }).optional(),
  phones: z.array(z.object({
    phone: z.string().optional(),
    wa_id: z.string().optional(),
    type: z.enum(['CELL', 'MAIN', 'IPHONE', 'HOME', 'WORK']).optional(),
  })).optional(),
  urls: z.array(z.object({
    url: z.string().url().optional(),
    type: z.enum(['HOME', 'WORK']).optional(),
  })).optional(),
});

export const interactiveMessageSchema = z.object({
  type: z.enum(['button', 'list', 'cta_url']),
  header: z.object({
    type: z.enum(['text', 'image', 'video', 'document']),
    text: z.string().max(60).optional(),
    image: mediaMessageSchema.optional(),
    video: mediaMessageSchema.optional(),
    document: mediaMessageSchema.optional(),
  }).optional(),
  body: z.object({
    text: z.string().min(1, 'Body text is required').max(1024),
  }),
  footer: z.object({
    text: z.string().max(60),
  }).optional(),
  action: z.object({
    buttons: z.array(z.object({
      type: z.literal('reply'),
      reply: z.object({
        id: z.string().min(1).max(256),
        title: z.string().min(1).max(20),
      }),
    })).max(3, 'Maximum 3 buttons allowed').optional(),
    button: z.string().max(20).optional(),
    sections: z.array(z.object({
      title: z.string().max(24).optional(),
      rows: z.array(z.object({
        id: z.string().min(1).max(200),
        title: z.string().min(1).max(24),
        description: z.string().max(72).optional(),
      })).min(1).max(10),
    })).max(10, 'Maximum 10 sections allowed').optional(),
    name: z.string().optional(),
    parameters: z.object({
      display_text: z.string().max(20),
      url: z.string().url(),
    }).optional(),
  }),
});

export const templateMessageSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  language: z.object({
    code: z.string().min(2, 'Language code is required'),
  }),
  components: z.array(z.object({
    type: z.enum(['header', 'body', 'footer', 'button']),
    sub_type: z.string().optional(),
    index: z.number().optional(),
    parameters: z.array(z.object({
      type: z.enum(['text', 'currency', 'date_time', 'image', 'document', 'video']),
      text: z.string().optional(),
      currency: z.object({
        fallback_value: z.string(),
        code: z.string().length(3),
        amount_1000: z.number(),
      }).optional(),
      date_time: z.object({
        fallback_value: z.string(),
      }).optional(),
      image: z.object({
        id: z.string().optional(),
        link: z.string().url().optional(),
      }).optional(),
      document: z.object({
        id: z.string().optional(),
        filename: z.string().optional(),
      }).optional(),
      video: z.object({
        id: z.string().optional(),
        link: z.string().url().optional(),
      }).optional(),
    })).optional(),
  })).optional(),
});

// Send message request validation
export const sendMessageSchema = z.object({
  to: phoneNumberSchema,
  type: z.nativeEnum(MessageType),
  content: z.union([
    textMessageSchema,
    mediaMessageSchema,
    locationMessageSchema,
    contactMessageSchema,
    interactiveMessageSchema,
    templateMessageSchema,
  ]),
  conversationId: z.string().optional(),
});

// Template creation validation
export const createTemplateSchema = z.object({
  name: z.string()
    .min(1, 'Template name is required')
    .max(512, 'Template name too long')
    .regex(/^[a-z0-9_]+$/, 'Template name must contain only lowercase letters, numbers, and underscores'),
  language: z.string().min(2, 'Language code is required'),
  category: z.nativeEnum(TemplateCategory),
  components: z.array(z.object({
    type: z.enum(['HEADER', 'BODY', 'FOOTER', 'BUTTONS']),
    format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
    text: z.string().optional(),
    example: z.object({
      header_text: z.array(z.string()).optional(),
      body_text: z.array(z.array(z.string())).optional(),
    }).optional(),
    buttons: z.array(z.object({
      type: z.enum(['QUICK_REPLY', 'URL', 'PHONE_NUMBER']),
      text: z.string().min(1).max(25),
      url: z.string().url().optional(),
      phone_number: phoneNumberSchema.optional(),
      example: z.array(z.string()).optional(),
    })).optional(),
  })).min(1, 'At least one component is required'),
});

// Template message sending validation
export const sendTemplateMessageSchema = z.object({
  to: phoneNumberSchema,
  templateName: z.string().min(1, 'Template name is required'),
  languageCode: z.string().min(2, 'Language code is required'),
  components: z.array(z.object({
    type: z.enum(['header', 'body', 'footer', 'button']),
    parameters: z.array(z.any()).optional(),
  })).optional(),
});

// Media message sending validation
export const sendMediaMessageSchema = z.object({
  to: phoneNumberSchema,
  mediaType: z.enum(['image', 'video', 'audio', 'document']),
  mediaUrl: z.string().url('Invalid media URL'),
  caption: z.string().max(1024, 'Caption too long').optional(),
  filename: z.string().optional(),
});

// Webhook validation
export const webhookVerificationSchema = z.object({
  'hub.mode': z.literal('subscribe'),
  'hub.verify_token': z.string().min(1),
  'hub.challenge': z.string().min(1),
});

// Organization identifier validation
export const orgIdentifierSchema = z.string()
  .min(1, 'Organization identifier is required')
  .regex(/^[a-z0-9-_]+$/, 'Invalid organization identifier format');

// Embedded signup validation
export const embeddedSignupSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});

// Validation middleware helper
export const validateSchema = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Query parameter validation helper
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Query validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Parameter validation helper
export const validateParams = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Parameter validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};