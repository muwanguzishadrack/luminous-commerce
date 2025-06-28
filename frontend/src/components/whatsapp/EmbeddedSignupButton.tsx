import React from 'react';
import { Button } from '../ui/button';
import { MessageSquare, Loader2, ExternalLink } from 'lucide-react';
import { WhatsAppService } from '../../services/whatsappService';
import { useOrganization } from '../../contexts/OrganizationContext';

interface EmbeddedSignupButtonProps {
  onSetupStart?: () => void;
  onSetupComplete?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

export const EmbeddedSignupButton: React.FC<EmbeddedSignupButtonProps> = ({
  onSetupStart,
  disabled = false,
  className = '',
  size = 'default',
  variant = 'default',
}) => {
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfigured, setIsConfigured] = React.useState(false);

  // Check if WhatsApp is already configured
  React.useEffect(() => {
    const checkConfiguration = async () => {
      if (organization?.id) {
        try {
          const configured = await WhatsAppService.isWhatsAppConfigured(organization.id);
          setIsConfigured(configured);
        } catch (error) {
          console.error('Failed to check WhatsApp configuration:', error);
        }
      }
    };

    checkConfiguration();
  }, [organization?.id]);

  const handleEmbeddedSignup = async () => {
    if (!organization?.id) {
      console.error('No organization found');
      return;
    }

    setIsLoading(true);
    onSetupStart?.();

    try {
      // Get configuration from environment variables
      const appId = import.meta.env.VITE_WHATSAPP_APP_ID;
      const configId = import.meta.env.VITE_WHATSAPP_CONFIG_ID;
      
      if (!appId || !configId) {
        throw new Error('WhatsApp app configuration not found. Please set VITE_WHATSAPP_APP_ID and VITE_WHATSAPP_CONFIG_ID environment variables.');
      }

      // Generate the redirect URL - use configured URL or fallback to current domain
      const redirectUrl = import.meta.env.VITE_WHATSAPP_REDIRECT_URL || `${window.location.origin}/whatsapp/callback`;
      
      // Generate state parameter for security (optional)
      const state = `${organization.id}_${Date.now()}`;

      // Generate the embedded signup URL
      const signupUrl = WhatsAppService.generateEmbeddedSignupUrl(
        appId,
        configId,
        redirectUrl,
        state
      );

      // Store the state in sessionStorage to verify on callback
      sessionStorage.setItem('whatsapp_signup_state', state);
      sessionStorage.setItem('whatsapp_signup_orgid', organization.id);

      // Redirect to Meta's embedded signup
      window.location.href = signupUrl;

    } catch (error: any) {
      console.error('Failed to start embedded signup:', error);
      setIsLoading(false);
      
      // You might want to show a toast notification here
      alert(error.message || 'Failed to start WhatsApp setup. Please try again.');
    }
  };

  const handleReconfigure = async () => {
    if (!organization?.id) return;

    const confirmed = window.confirm(
      'Are you sure you want to reconfigure WhatsApp? This will disconnect your current WhatsApp Business account.'
    );

    if (confirmed) {
      handleEmbeddedSignup();
    }
  };

  if (isConfigured) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Connected</span>
        </div>
        <Button
          onClick={handleReconfigure}
          variant="outline"
          size="sm"
          disabled={disabled}
          className={className}
        >
          Reconfigure
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleEmbeddedSignup}
      disabled={disabled || isLoading}
      size={size}
      variant={variant}
      className={`${className} relative`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <MessageSquare className="mr-2 h-4 w-4" />
          Connect WhatsApp Business
          <ExternalLink className="ml-2 h-3 w-3" />
        </>
      )}
    </Button>
  );
};

// Hook for handling the callback from Meta
export const useEmbeddedSignupCallback = () => {
  const { organization } = useOrganization();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCallback = React.useCallback(async (code: string, state?: string) => {
    if (!organization?.id) {
      setError('No organization found');
      return false;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Verify state parameter for security
      const storedState = sessionStorage.getItem('whatsapp_signup_state');
      const storedOrgId = sessionStorage.getItem('whatsapp_signup_orgid');

      if (state && storedState && state !== storedState) {
        throw new Error('Invalid state parameter. Setup may have been tampered with.');
      }

      if (storedOrgId && storedOrgId !== organization.id) {
        throw new Error('Organization mismatch. Please try again.');
      }

      // Complete the embedded signup process
      const result = await WhatsAppService.handleEmbeddedSignup(code, state);

      if (result.success) {
        // Clear stored state
        sessionStorage.removeItem('whatsapp_signup_state');
        sessionStorage.removeItem('whatsapp_signup_orgid');
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to complete setup');
      }

    } catch (error: any) {
      console.error('Embedded signup callback error:', error);
      setError(error.message || 'Failed to complete WhatsApp setup');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [organization?.id]);

  return {
    handleCallback,
    isProcessing,
    error,
    clearError: () => setError(null),
  };
};

export default EmbeddedSignupButton;