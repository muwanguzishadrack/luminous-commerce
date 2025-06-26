import { api, ApiResponse, handleApiError } from '../lib/api';
import {
  Organization,
  OrganizationWithUsers,
  UpdateOrganizationRequest,
  AddUserToOrganizationRequest,
  UpdateUserRoleRequest,
  OrganizationStats,
  OrganizationUser,
} from '../types/organization';

export class OrganizationService {
  // Get public organization info by slug
  static async getPublicOrganization(slug: string): Promise<Organization> {
    try {
      const response = await api.get<ApiResponse<Organization>>(`/organizations/public/${slug}`);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Get current user's organization with users
  static async getCurrentOrganization(): Promise<OrganizationWithUsers> {
    try {
      const response = await api.get<ApiResponse<OrganizationWithUsers>>('/organizations/current');
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Update current organization
  static async updateOrganization(data: UpdateOrganizationRequest): Promise<Organization> {
    try {
      const response = await api.put<ApiResponse<Organization>>('/organizations/current', data);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Delete/deactivate current organization
  static async deleteOrganization(): Promise<void> {
    try {
      await api.delete('/organizations/current');
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Add user to organization
  static async addUser(data: AddUserToOrganizationRequest): Promise<OrganizationUser> {
    try {
      const response = await api.post<ApiResponse<OrganizationUser>>('/organizations/users', data);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Remove user from organization
  static async removeUser(userId: string): Promise<void> {
    try {
      await api.delete(`/organizations/users/${userId}`);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Update user role
  static async updateUserRole(userId: string, data: UpdateUserRoleRequest): Promise<OrganizationUser> {
    try {
      const response = await api.put<ApiResponse<OrganizationUser>>(`/organizations/users/${userId}/role`, data);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Get organization statistics
  static async getStats(): Promise<OrganizationStats> {
    try {
      const response = await api.get<ApiResponse<OrganizationStats>>('/organizations/stats');
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }
}