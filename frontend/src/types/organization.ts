import { UserRole } from './auth';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  timezone: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationWithUsers extends Organization {
  users: OrganizationUser[];
}

export interface OrganizationUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  timezone?: string;
  currency?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  logo?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  timezone?: string;
  currency?: string;
}

export interface AddUserToOrganizationRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface OrganizationStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}