import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  MessageSquare 
} from 'lucide-react';
import { useEmbeddedSignupCallback } from './EmbeddedSignupButton';

export const WhatsAppCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isProcessing, error, clearError } = useEmbeddedSignupCallback();
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle OAuth errors
      if (errorParam) {
        console.error('OAuth error:', errorParam, errorDescription);
        return;
      }

      // Handle successful OAuth response
      if (code) {
        try {
          const success = await handleCallback(code, state || undefined);
          if (success) {
            setIsComplete(true);
          }
        } catch (error) {
          console.error('Callback processing error:', error);
        }
      }
    };

    processCallback();
  }, [searchParams, handleCallback]);

  const handleContinue = () => {
    // Navigate to WhatsApp settings or dashboard
    navigate('/settings/whatsapp');
  };

  const handleRetry = () => {
    clearError();
    navigate('/settings/whatsapp');
  };

  // OAuth error from URL params
  const oauthError = searchParams.get('error');
  const oauthErrorDescription = searchParams.get('error_description');

  if (oauthError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Setup Failed</CardTitle>
            <CardDescription>
              There was an error during the WhatsApp setup process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">{oauthError}</p>
                  {oauthErrorDescription && (
                    <p className="text-sm">{oauthErrorDescription}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Common reasons for setup failure:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Access was denied during authorization</li>
                <li>Invalid app configuration</li>
                <li>WhatsApp Business Account not properly set up</li>
                <li>Insufficient permissions</li>
              </ul>
            </div>

            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Setting Up WhatsApp</CardTitle>
            <CardDescription>
              Please wait while we configure your WhatsApp Business integration...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✓ Authorizing with Meta</p>
                <p>⏳ Configuring WhatsApp Business Account</p>
                <p>⏳ Setting up phone number</p>
                <p>⏳ Configuring webhooks</p>
                <p>⏳ Syncing templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Setup Error</CardTitle>
            <CardDescription>
              An error occurred while setting up your WhatsApp integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You can try the following:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Check your internet connection</li>
                <li>Ensure your WhatsApp Business Account is properly configured</li>
                <li>Try the setup process again</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>

            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Setup Complete!</CardTitle>
            <CardDescription>
              Your WhatsApp Business integration has been configured successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                You can now send and receive WhatsApp messages through your dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm font-medium">What's next?</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Complete your business profile</li>
                <li>Create message templates</li>
                <li>Start conversations with customers</li>
                <li>Set up automated responses</li>
              </ul>
            </div>

            <Button onClick={handleContinue} className="w-full">
              Go to WhatsApp Settings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state (while determining what to do)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Processing...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppCallback;