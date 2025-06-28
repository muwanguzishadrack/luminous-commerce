import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { 
  MessageSquare, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface ManualSetupCredentials {
  access_token: string;
  app_id: string;
  phone_number_id: string;
  waba_id: string;
}

interface ManualSetupFormProps {
  onSetupComplete?: (config: any) => void;
  onCancel?: () => void;
}

export const ManualSetupForm: React.FC<ManualSetupFormProps> = ({
  onSetupComplete,
  onCancel
}) => {
  const { organization } = useOrganization();
  const [credentials, setCredentials] = useState<ManualSetupCredentials>({
    access_token: '',
    app_id: '',
    phone_number_id: '',
    waba_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleInputChange = (field: keyof ManualSetupCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    const required = ['access_token', 'app_id', 'phone_number_id', 'waba_id'];
    const missing = required.filter(field => !credentials[field as keyof ManualSetupCredentials]);
    
    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(', ')}`);
      return false;
    }

    // Basic format validation
    if (!credentials.access_token.startsWith('EAA')) {
      setError('Invalid access token format. Should start with "EAA"');
      return false;
    }

    if (!/^\d+$/.test(credentials.app_id)) {
      setError('Invalid App ID format. Should be numeric');
      return false;
    }

    if (!/^\d+$/.test(credentials.phone_number_id)) {
      setError('Invalid Phone Number ID format. Should be numeric');
      return false;
    }

    if (!/^\d+$/.test(credentials.waba_id)) {
      setError('Invalid WABA ID format. Should be numeric');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization?.id) {
      setError('Organization not found');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/whatsapp/setup/${organization.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSetupComplete?.(result.data);
      } else {
        setError(result.message || 'Setup failed. Please check your credentials.');
      }

    } catch (error: any) {
      console.error('Setup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Setup WhatsApp Business</h2>
          <p className="text-muted-foreground">
            Enter your WhatsApp Business API credentials to connect your account.
          </p>
        </div>
      </div>

      {/* Help Section Toggle */}
      <div className="text-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          {showHelp ? 'Hide' : 'Show'} Setup Instructions
        </Button>
      </div>

      {/* Setup Instructions */}
      {showHelp && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Where to Find Your Credentials</CardTitle>
            <CardDescription>
              Follow these steps to get your WhatsApp Business API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">1. Access Token</h4>
                  <p className="text-xs text-muted-foreground">
                    Go to Facebook Developer Console → Your App → WhatsApp → API Setup
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Developer Console
                    </a>
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm">2. App ID</h4>
                  <p className="text-xs text-muted-foreground">
                    Facebook Developer Console → App Settings → Basic → App ID
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">3. Phone Number ID</h4>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp Manager → Phone Number → Settings → Phone Number ID
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://business.facebook.com/wa/manage/home" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      WhatsApp Manager
                    </a>
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium text-sm">4. WABA ID</h4>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp Manager → Account Settings → WhatsApp Business Account ID
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Form */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business Credentials</CardTitle>
          <CardDescription>
            Enter the required credentials from your Facebook Developer Console and WhatsApp Manager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="access_token">
                  Access Token <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="access_token"
                  placeholder="EAAxxxxxxxxxxxxxxxxx..."
                  value={credentials.access_token}
                  onChange={(e) => handleInputChange('access_token', e.target.value)}
                  required
                  rows={3}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Long-lived access token from Facebook Developer Console
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app_id">
                  App ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="app_id"
                  placeholder="123456789012345"
                  value={credentials.app_id}
                  onChange={(e) => handleInputChange('app_id', e.target.value)}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Facebook App ID from App Settings → Basic
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number_id">
                  Phone Number ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number_id"
                  placeholder="111111111111111"
                  value={credentials.phone_number_id}
                  onChange={(e) => handleInputChange('phone_number_id', e.target.value)}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  From WhatsApp Manager → Phone Number Settings
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waba_id">
                  WABA ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="waba_id"
                  placeholder="222222222222222"
                  value={credentials.waba_id}
                  onChange={(e) => handleInputChange('waba_id', e.target.value)}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  WhatsApp Business Account ID from Account Settings
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Setup WhatsApp
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your credentials are securely stored and encrypted. We'll validate them with Facebook 
          to ensure they're working properly before completing the setup.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ManualSetupForm;