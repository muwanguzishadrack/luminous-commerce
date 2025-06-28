import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Settings,
  Phone,
  User
} from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { WhatsAppService } from '../../services/whatsappService';
import { WhatsAppSetupWizard } from '../whatsapp/WhatsAppSetupWizard';

const WhatsAppSettings: React.FC = () => {
  const { organization } = useOrganization();
  const [isConfigured, setIsConfigured] = React.useState(false);
  const [showSetupWizard, setShowSetupWizard] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [setupProgress, setSetupProgress] = React.useState<any>(null);

  // Check WhatsApp configuration status
  React.useEffect(() => {
    const checkConfiguration = async () => {
      if (!organization?.id) return;

      setIsLoading(true);
      try {
        const [configured, progress] = await Promise.all([
          WhatsAppService.isWhatsAppConfigured(organization.id),
          WhatsAppService.getSetupProgress(organization.id).catch(() => null)
        ]);
        
        setIsConfigured(configured);
        setSetupProgress(progress);
      } catch (error) {
        console.error('Failed to check WhatsApp configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConfiguration();
  }, [organization?.id]);

  const handleSetupComplete = () => {
    setShowSetupWizard(false);
    setIsConfigured(true);
    // Refresh the page or update state as needed
    window.location.reload();
  };

  if (showSetupWizard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">WhatsApp Business Setup</h2>
            <p className="text-muted-foreground">
              Complete your WhatsApp Business integration setup.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowSetupWizard(false)}
          >
            Back to Settings
          </Button>
        </div>
        <WhatsAppSetupWizard 
          onComplete={handleSetupComplete}
          onCancel={() => setShowSetupWizard(false)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WhatsApp Settings</h2>
          <p className="text-muted-foreground">
            Manage your WhatsApp Business integration.
          </p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
                <p className="text-muted-foreground">Loading WhatsApp settings...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">WhatsApp Settings</h2>
        <p className="text-muted-foreground">
          Manage your WhatsApp Business integration and messaging settings.
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Business Status
          </CardTitle>
          <CardDescription>
            Current status of your WhatsApp Business integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConfigured ? (
            <div className="space-y-4">
              {/* Connected Status */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">WhatsApp Connected</h3>
                  <p className="text-sm text-green-700">
                    Your WhatsApp Business account is successfully integrated and ready to use.
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>

              {/* Setup Progress */}
              {setupProgress && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Phone Number</p>
                      <p className="text-xs text-muted-foreground">
                        {setupProgress.hasPhoneNumber ? 'Configured' : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Business Profile</p>
                      <p className="text-xs text-muted-foreground">
                        {setupProgress.hasBusinessProfile ? 'Complete' : 'Incomplete'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Settings className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Account Status</p>
                      <p className="text-xs text-muted-foreground">
                        {setupProgress.accountStatus || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => setShowSetupWizard(true)}
                  variant="outline"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Settings
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://business.facebook.com/wa/manage/home" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    WhatsApp Manager
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Not Connected Status */}
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">WhatsApp Not Connected</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Connect your WhatsApp Business account to start messaging customers directly 
                    from your dashboard.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="space-y-3">
                  <h4 className="font-medium">What you'll get:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Send and receive WhatsApp messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Create and manage message templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Automated customer support</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Features included:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Rich media support (images, videos, documents)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Business profile management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Real-time message notifications</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Setup Alert */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You'll need a Meta Business account and WhatsApp Business Account (WABA) to continue.
                  Don't worry - we'll guide you through the process.
                </AlertDescription>
              </Alert>

              {/* Setup Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setShowSetupWizard(true)}
                  size="lg"
                  className="min-w-[200px]"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Setup WhatsApp Business
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Helpful resources for managing your WhatsApp Business integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" asChild>
              <a 
                href="https://developers.facebook.com/docs/whatsapp/business-management-api/get-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="justify-start"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                WhatsApp Business API Documentation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a 
                href="https://developers.facebook.com/apps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="justify-start"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Meta Developer Console
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSettings;