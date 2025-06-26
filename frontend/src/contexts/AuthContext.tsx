import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest, JoinOrganizationRequest, UserRole } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  joinOrganization: (data: JoinOrganizationRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if auth is disabled for development
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';

  const isAuthenticated = isAuthDisabled || (!!user && AuthService.isAuthenticated());

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // If auth is disabled, create a mock user and skip auth checks
        if (isAuthDisabled) {
          const mockUser: User = {
            id: 'dev-user-1',
            firstName: 'Dev',
            lastName: 'User',
            email: 'dev@luminous.local',
            phoneNumber: '+256700000000',
            businessName: 'Dev Business',
            role: UserRole.ADMIN,
            organizationId: 'dev-org-1',
            organization: {
              id: 'dev-org-1',
              name: 'Dev Business',
              slug: 'dev-business',
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(mockUser);
          setIsLoading(false);
          return;
        }

        const storedUser = AuthService.getStoredUser();
        const accessToken = AuthService.getAccessToken();

        if (storedUser && accessToken) {
          // Verify token is still valid by fetching current user
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else {
          // Clear any invalid tokens
          AuthService.clearTokens();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid tokens
        AuthService.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isAuthDisabled]);

  const handleAuthSuccess = (authResponse: AuthResponse) => {
    AuthService.saveTokens(authResponse);
    // Convert AuthResponse user to full User type
    const fullUser: User = {
      ...authResponse.user,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(fullUser);
  };

  const login = async (data: LoginRequest): Promise<void> => {
    try {
      const response = await AuthService.login(data);
      handleAuthSuccess(response);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      const response = await AuthService.register(data);
      handleAuthSuccess(response);
    } catch (error) {
      throw error;
    }
  };

  const joinOrganization = async (data: JoinOrganizationRequest): Promise<void> => {
    try {
      const response = await AuthService.joinOrganization(data);
      handleAuthSuccess(response);
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (AuthService.isAuthenticated()) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    joinOrganization,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};