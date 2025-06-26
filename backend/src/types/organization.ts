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
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  timezone?: string;
  currency?: string;
}

export interface OrganizationResponse {
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
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
  };
}

export interface OrganizationWithUsers extends OrganizationResponse {
  users: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
  }[];
}