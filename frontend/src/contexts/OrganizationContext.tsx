import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  OrganizationWithUsers,
  UpdateOrganizationRequest,
  AddUserToOrganizationRequest,
  UpdateUserRoleRequest,
  OrganizationStats,
} from '../types/organization';
import { OrganizationService } from '../services/organizationService';
import { useAuth } from './AuthContext';

interface OrganizationContextType {
  organization: OrganizationWithUsers | null;
  stats: OrganizationStats | null;
  isLoading: boolean;
  error: Error | null;
  updateOrganization: (data: UpdateOrganizationRequest) => Promise<void>;
  addUser: (data: AddUserToOrganizationRequest) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: UpdateUserRoleRequest) => Promise<void>;
  refreshOrganization: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current organization
  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
    refetch: refetchOrganization,
  } = useQuery({
    queryKey: ['organization', 'current'],
    queryFn: OrganizationService.getCurrentOrganization,
    enabled: isAuthenticated && !!user?.organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch organization stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['organization', 'stats'],
    queryFn: OrganizationService.getStats,
    enabled: isAuthenticated && !!user?.organizationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Update organization mutation
  const updateOrganizationMutation = useMutation({
    mutationFn: OrganizationService.updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: OrganizationService.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['organization', 'stats'] });
    },
  });

  // Remove user mutation
  const removeUserMutation = useMutation({
    mutationFn: OrganizationService.removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['organization', 'stats'] });
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRoleRequest }) =>
      OrganizationService.updateUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'current'] });
    },
  });

  const updateOrganization = async (data: UpdateOrganizationRequest): Promise<void> => {
    await updateOrganizationMutation.mutateAsync(data);
  };

  const addUser = async (data: AddUserToOrganizationRequest): Promise<void> => {
    await addUserMutation.mutateAsync(data);
  };

  const removeUser = async (userId: string): Promise<void> => {
    await removeUserMutation.mutateAsync(userId);
  };

  const updateUserRole = async (userId: string, data: UpdateUserRoleRequest): Promise<void> => {
    await updateUserRoleMutation.mutateAsync({ userId, data });
  };

  const refreshOrganization = () => {
    refetchOrganization();
    queryClient.invalidateQueries({ queryKey: ['organization', 'stats'] });
  };

  const value: OrganizationContextType = {
    organization: organization || null,
    stats: stats || null,
    isLoading: orgLoading || statsLoading,
    error: orgError || statsError,
    updateOrganization,
    addUser,
    removeUser,
    updateUserRole,
    refreshOrganization,
  };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};