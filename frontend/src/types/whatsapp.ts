export interface WhatsAppConfig {
  is_embedded_signup?: boolean;
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

export interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  industry?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: BusinessVertical;
}

export type BusinessVertical =
  | 'UNDEFINED'
  | 'OTHER'
  | 'AUTO'
  | 'BEAUTY'
  | 'APPAREL'
  | 'EDU'
  | 'ENTERTAIN'
  | 'EVENT_PLAN'
  | 'FINANCE'
  | 'GROCERY'
  | 'GOVT'
  | 'HOTEL'
  | 'HEALTH'
  | 'NONPROFIT'
  | 'PROF_SERVICES'
  | 'RETAIL'
  | 'TRAVEL'
  | 'RESTAURANT'
  | 'NOT_A_BIZ';

export interface WhatsAppSetupResult {
  phone_number_id: string;
  display_phone_number: string;
  verified_name: string;
  quality_rating: string;
  account_review_status: string;
  business_profile: BusinessProfile;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AccountStatus {
  phone_details: {
    status: string;
    display_phone_number: string;
    verified_name: string;
    quality_rating: string;
    name_status: string;
    messaging_limit_tier: string;
  };
  review_status: {
    account_review_status: string;
  };
  business_profile: BusinessProfile;
  last_updated: string;
}

export interface SetupProgress {
  isConfigured: boolean;
  hasPhoneNumber: boolean;
  hasBusinessProfile: boolean;
  accountStatus: AccountStatus['review_status']['account_review_status'];
  qualityRating: AccountStatus['phone_details']['quality_rating'];
}

export interface WhatsAppTemplate {
  id: string;
  organizationId: string;
  metaId: string;
  name: string;
  language: string;
  category: TemplateCategory;
  status: TemplateStatus;
  metadata: any;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
export type TemplateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED';

export interface WhatsAppContact {
  id: string;
  organizationId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  address?: string;
  isBlocked: boolean;
  isFavorite: boolean;
  lastMessageAt?: string;
  contactGroupId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppMessage {
  id: string;
  organizationId: string;
  wamId?: string;
  conversationId: string;
  contactId?: string;
  type: MessageType;
  metadata: any;
  direction: MessageDirection;
  status: MessageStatus;
  userId?: string;
  mediaId?: string;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
  contact?: WhatsAppContact;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type MessageType =
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'DOCUMENT'
  | 'LOCATION'
  | 'CONTACT'
  | 'TEMPLATE'
  | 'INTERACTIVE'
  | 'REACTION'
  | 'SYSTEM';

export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

// Setup flow types
export interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  optional?: boolean;
}

export interface EmbeddedSignupState {
  step: number;
  isLoading: boolean;
  error: string | null;
  config: WhatsAppConfig | null;
  progress: SetupProgress | null;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
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

export interface TemplateMessageContent {
  name: string;
  language: {
    code: string;
  };
  components?: Array<{
    type: 'header' | 'body' | 'footer' | 'button';
    parameters?: any[];
  }>;
}

export type MessageContent =
  | TextMessageContent
  | MediaMessageContent
  | LocationMessageContent
  | TemplateMessageContent;

// Form types
export interface BusinessProfileFormData {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  websites?: string[];
  vertical?: BusinessVertical;
}

export interface SendMessageFormData {
  to: string;
  type: MessageType;
  content: MessageContent;
  conversationId?: string;
}

// Hook return types
export interface UseWhatsAppSetup {
  state: EmbeddedSignupState;
  startSetup: () => void;
  handleCallback: (code: string, state?: string) => Promise<void>;
  updateBusinessProfile: (profile: BusinessProfileFormData) => Promise<void>;
  validateConfig: () => Promise<ValidationResult>;
  refreshStatus: () => Promise<void>;
  resetSetup: () => void;
}

export interface UseWhatsAppMessaging {
  sendMessage: (data: SendMessageFormData) => Promise<void>;
  sendTemplateMessage: (data: {
    to: string;
    templateName: string;
    languageCode: string;
    components?: any[];
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Constants
export const SETUP_STEPS: SetupStep[] = [
  {
    id: 'start',
    title: 'Start Setup',
    description: 'Begin WhatsApp Business integration',
    completed: false,
    current: true,
  },
  {
    id: 'oauth',
    title: 'Connect Account',
    description: 'Authorize with Meta/Facebook',
    completed: false,
    current: false,
  },
  {
    id: 'phone',
    title: 'Phone Number',
    description: 'Select and verify phone number',
    completed: false,
    current: false,
  },
  {
    id: 'profile',
    title: 'Business Profile',
    description: 'Configure your business information',
    completed: false,
    current: false,
    optional: true,
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Setup completed successfully',
    completed: false,
    current: false,
  },
];

export const BUSINESS_VERTICALS: { value: BusinessVertical; label: string }[] = [
  { value: 'OTHER', label: 'Other' },
  { value: 'AUTO', label: 'Automotive' },
  { value: 'BEAUTY', label: 'Beauty, Spa & Salon' },
  { value: 'APPAREL', label: 'Clothing & Apparel' },
  { value: 'EDU', label: 'Education' },
  { value: 'ENTERTAIN', label: 'Entertainment' },
  { value: 'EVENT_PLAN', label: 'Event Planning & Service' },
  { value: 'FINANCE', label: 'Finance & Banking' },
  { value: 'GROCERY', label: 'Grocery & Food' },
  { value: 'GOVT', label: 'Government' },
  { value: 'HOTEL', label: 'Hotel & Lodging' },
  { value: 'HEALTH', label: 'Medical & Health' },
  { value: 'NONPROFIT', label: 'Non-profit' },
  { value: 'PROF_SERVICES', label: 'Professional Services' },
  { value: 'RETAIL', label: 'Shopping & Retail' },
  { value: 'TRAVEL', label: 'Travel & Transportation' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'NOT_A_BIZ', label: 'Not a Business' },
];

export const QUALITY_RATING_COLORS = {
  GREEN: 'text-green-600 bg-green-50',
  YELLOW: 'text-yellow-600 bg-yellow-50',
  RED: 'text-red-600 bg-red-50',
  UNKNOWN: 'text-gray-600 bg-gray-50',
};

export const ACCOUNT_STATUS_COLORS = {
  APPROVED: 'text-green-600 bg-green-50',
  PENDING: 'text-yellow-600 bg-yellow-50',
  REJECTED: 'text-red-600 bg-red-50',
  UNKNOWN: 'text-gray-600 bg-gray-50',
};