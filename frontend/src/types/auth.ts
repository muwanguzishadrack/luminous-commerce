export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  businessName: string;
  phoneNumber: string;
}

export interface JoinOrganizationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organizationSlug: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    businessName: string;
    role: UserRole;
    organizationId: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  };
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  role: UserRole;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN', 
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

