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
  countryCode?: string;
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}


export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationSlug: string;
  iat?: number;
  exp?: number;
}

// Import UserRole from Prisma to avoid enum conflicts
import { UserRole } from '@prisma/client';
export { UserRole };