import { 
  Organization,
  WhatsAppMessage, 
  WhatsAppTemplate, 
  WhatsAppContact,
  MessageType,
  MessageDirection,
  MessageStatus,
  TemplateCategory,
  TemplateStatus
} from '@prisma/client';

// Manual Setup Credentials Interface
export interface ManualSetupCredentials {
  access_token: string;
  app_id: string;
  phone_number_id: string;
  waba_id: string;
}

// Base WhatsApp types from Prisma
export {
  WhatsAppMessage,
  WhatsAppTemplate,
  WhatsAppContact,
  MessageType,
  MessageDirection,
  MessageStatus,
  TemplateCategory,
  TemplateStatus
};

// WhatsApp configuration structure (stored in Organization.metadata.whatsapp)
export interface WhatsAppConfig {
  is_embedded_signup?: boolean;
  access_token?: string;
  app_id?: string;
  client_id?: string;
  client_secret?: string;
  config_id?: string;
  waba_id?: string;
  phone_number_id?: string;
  display_phone_number?: string;
  verified_name?: string;
  quality_rating?: string;
  name_status?: string;
  messaging_limit_tier?: string;
  max_daily_conversation_per_phone?: number | null;
  max_phone_numbers_per_business?: number | null;
  number_status?: string;
  code_verification_status?: string;
  business_verification?: string;
  account_review_status?: string;
  business_profile?: BusinessProfile;
}

// Organization with WhatsApp metadata
export interface OrganizationWithWhatsApp extends Organization {
  metadata: {
    whatsapp?: WhatsAppConfig;
    [key: string]: any;
  } | null;
}

export interface WhatsAppMessageWithRelations extends WhatsAppMessage {
  organization?: Organization;
  contact?: WhatsAppContact;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface WhatsAppContactWithRelations extends WhatsAppContact {
  organization?: Organization;
  messages?: WhatsAppMessage[];
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface WhatsAppTemplateWithRelations extends WhatsAppTemplate {
  organization?: Organization;
}

// Business Profile types
export interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: string;
}

// Message content types
export interface TextMessageContent {
  body: string;
  preview_url?: boolean;
}

export interface MediaMessageContent {
  type: 'image' | 'video' | 'audio' | 'document';
  url?: string;
  id?: string;
  caption?: string;
  filename?: string;
}

export interface LocationMessageContent {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ContactMessageContent {
  addresses?: Array<{
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    type?: string;
  }>;
  birthday?: string;
  emails?: Array<{
    email?: string;
    type?: string;
  }>;
  name: {
    formatted_name: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    suffix?: string;
    prefix?: string;
  };
  org?: {
    company?: string;
    department?: string;
    title?: string;
  };
  phones?: Array<{
    phone?: string;
    wa_id?: string;
    type?: string;
  }>;
  urls?: Array<{
    url?: string;
    type?: string;
  }>;
}

export interface InteractiveMessageContent {
  type: 'button' | 'list' | 'cta_url';
  header?: {
    type: 'text' | 'image' | 'video' | 'document';
    text?: string;
    image?: MediaMessageContent;
    video?: MediaMessageContent;
    document?: MediaMessageContent;
  };
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: {
    buttons?: Array<{
      type: 'reply';
      reply: {
        id: string;
        title: string;
      };
    }>;
    button?: string;
    sections?: Array<{
      title?: string;
      rows: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>;
    name?: string;
    parameters?: {
      display_text: string;
      url: string;
    };
  };
}

export interface TemplateMessageContent {
  name: string;
  language: {
    code: string;
  };
  components?: Array<{
    type: 'header' | 'body' | 'footer' | 'button';
    sub_type?: string;
    index?: number;
    parameters?: Array<{
      type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
      text?: string;
      currency?: {
        fallback_value: string;
        code: string;
        amount_1000: number;
      };
      date_time?: {
        fallback_value: string;
      };
      image?: {
        id?: string;
        link?: string;
      };
      document?: {
        id?: string;
        filename?: string;
      };
      video?: {
        id?: string;
        link?: string;
      };
    }>;
  }>;
}

export type MessageContent = 
  | TextMessageContent
  | MediaMessageContent
  | LocationMessageContent
  | ContactMessageContent
  | InteractiveMessageContent
  | TemplateMessageContent;

// Template component types
export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phone_number?: string;
    example?: string[];
  }>;
}

// API request/response types
export interface CreateWhatsAppConfigRequest {
  app_id: string;
  client_id: string;
  client_secret: string;
  config_id: string;
  access_token?: string;
  waba_id?: string;
  phone_number_id?: string;
  display_phone_number?: string;
  verified_name?: string;
  business_profile?: BusinessProfile;
}

export interface UpdateWhatsAppConfigRequest {
  app_id?: string;
  client_id?: string;
  client_secret?: string;
  config_id?: string;
  access_token?: string;
  waba_id?: string;
  phone_number_id?: string;
  display_phone_number?: string;
  verified_name?: string;
  quality_rating?: string;
  business_profile?: BusinessProfile;
  is_embedded_signup?: boolean;
}

export interface SendMessageRequest {
  to: string;
  type: MessageType;
  content: MessageContent;
  conversationId?: string;
}

export interface CreateTemplateRequest {
  name: string;
  language: string;
  category: TemplateCategory;
  components: TemplateComponent[];
}

// Meta API types
export interface MetaOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaTokenDebugResponse {
  data: {
    app_id: string;
    type: string;
    application: string;
    data_access_expires_at: number;
    expires_at: number;
    is_valid: boolean;
    scopes: string[];
    user_id: string;
  };
}

export interface MetaWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: {
          name: string;
        };
        wa_id: string;
      }>;
      messages?: Array<{
        from: string;
        id: string;
        timestamp: string;
        type: MessageType;
        text?: {
          body: string;
        };
        image?: {
          id: string;
          mime_type: string;
          sha256: string;
          caption?: string;
        };
        video?: {
          id: string;
          mime_type: string;
          sha256: string;
          caption?: string;
        };
        audio?: {
          id: string;
          mime_type: string;
          sha256: string;
        };
        document?: {
          id: string;
          mime_type: string;
          sha256: string;
          filename?: string;
          caption?: string;
        };
        location?: {
          latitude: number;
          longitude: number;
          name?: string;
          address?: string;
        };
        contacts?: ContactMessageContent[];
        interactive?: {
          type: string;
          button_reply?: {
            id: string;
            title: string;
          };
          list_reply?: {
            id: string;
            title: string;
            description?: string;
          };
        };
        button?: {
          payload: string;
          text: string;
        };
        context?: {
          from: string;
          id: string;
        };
      }>;
      statuses?: Array<{
        id: string;
        status: MessageStatus;
        timestamp: string;
        recipient_id: string;
        conversation?: {
          id: string;
          expiration_timestamp?: string;
          origin: {
            type: string;
          };
        };
        pricing?: {
          billable: boolean;
          pricing_model: string;
          category: string;
        };
        errors?: Array<{
          code: number;
          title: string;
          message: string;
          error_data?: {
            details: string;
          };
        }>;
      }>;
    };
    field: string;
  }>;
}

export interface MetaWebhookPayload {
  object: string;
  entry: MetaWebhookEntry[];
}

// Error types
export class WhatsAppError extends Error {
  code?: string;
  details?: any;
  statusCode?: number;

  constructor(message: string, code?: string, details?: any, statusCode?: number) {
    super(message);
    this.name = 'WhatsAppError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}