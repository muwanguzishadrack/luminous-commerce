import { api, ApiResponse, handleApiError } from '../lib/api';
import {
  LoginRequest,
  RegisterRequest,
  JoinOrganizationRequest,
  AuthResponse,
  User,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types/auth';
import { UpdateOrganizationRequest } from '../types/organization';

export class AuthService {
  // Register new organization and user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Join existing organization
  static async joinOrganization(data: JoinOrganizationRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/join-organization', data);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Don't throw error for logout - just clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local storage
      this.clearTokens();
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token', {
        refreshToken,
      });
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Forgot password
  static async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await api.post('/auth/forgot-password', data);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Reset password
  static async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Update organization
  static async updateOrganization(data: UpdateOrganizationRequest): Promise<void> {
    try {
      await api.put('/organizations/current', data);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  // Token management helpers
  static saveTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }

  static getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  static clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getStoredUser();
  }
}

// Export an instance for easier use in components
export const authService = AuthService;