import React from 'react';
import { WhatsAppService } from '../services/whatsappService';
import { useOrganization } from '../contexts/OrganizationContext';
import { 
  WhatsAppConfig, 
  SetupProgress, 
  ValidationResult, 
  AccountStatus,
  BusinessProfile 
} from '../types/whatsapp';

export interface UseWhatsAppReturn {
  // State
  config: WhatsAppConfig | null;
  progress: SetupProgress | null;
  validation: ValidationResult | null;
  accountStatus: AccountStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => Promise<void>;
  validateConfig: () => Promise<ValidationResult>;
  isConfigured: boolean;
  clearError: () => void;
}

export const useWhatsApp = (): UseWhatsAppReturn => {
  const { organization } = useOrganization();
  const [config, setConfig] = React.useState<WhatsAppConfig | null>(null);
  const [progress, setProgress] = React.useState<SetupProgress | null>(null);
  const [validation, setValidation] = React.useState<ValidationResult | null>(null);
  const [accountStatus, setAccountStatus] = React.useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadWhatsAppData = React.useCallback(async () => {
    if (!organization?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [configResult, progressResult, statusResult] = await Promise.allSettled([
        WhatsAppService.getWhatsAppSettings(organization.id),
        WhatsAppService.getSetupProgress(organization.id),
        WhatsAppService.getAccountStatus(organization.id),
      ]);

      if (configResult.status === 'fulfilled') {
        setConfig(configResult.value);
      } else {
        setConfig(null);
      }

      if (progressResult.status === 'fulfilled') {
        setProgress(progressResult.value);
      }

      if (statusResult.status === 'fulfilled') {
        setAccountStatus(statusResult.value);
      }

    } catch (error: any) {
      setError(error.message || 'Failed to load WhatsApp data');
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id]);

  const validateConfig = React.useCallback(async (): Promise<ValidationResult> => {
    if (!organization?.id) {
      throw new Error('No organization found');
    }

    try {
      const result = await WhatsAppService.validateConfiguration(organization.id);
      setValidation(result);
      return result;
    } catch (error: any) {
      const errorResult: ValidationResult = {
        isValid: false,
        errors: [error.message || 'Validation failed'],
        warnings: [],
      };
      setValidation(errorResult);
      throw error;
    }
  }, [organization?.id]);

  const updateBusinessProfile = React.useCallback(async (profile: Partial<BusinessProfile>) => {
    if (!organization?.id) {
      throw new Error('No organization found');
    }

    try {
      await WhatsAppService.updateBusinessProfile(organization.id, profile);
      
      // Refresh data after update
      await loadWhatsAppData();
    } catch (error: any) {
      setError(error.message || 'Failed to update business profile');
      throw error;
    }
  }, [organization?.id, loadWhatsAppData]);

  const refreshData = React.useCallback(async () => {
    await loadWhatsAppData();
  }, [loadWhatsAppData]);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Load data on mount and when organization changes
  React.useEffect(() => {
    loadWhatsAppData();
  }, [loadWhatsAppData]);

  const isConfigured = React.useMemo(() => {
    return !!(
      config?.access_token &&
      config?.phone_number_id &&
      config?.waba_id &&
      config?.is_embedded_signup
    );
  }, [config]);

  return {
    config,
    progress,
    validation,
    accountStatus,
    isLoading,
    error,
    refreshData,
    updateBusinessProfile,
    validateConfig,
    isConfigured,
    clearError,
  };
};

export default useWhatsApp;