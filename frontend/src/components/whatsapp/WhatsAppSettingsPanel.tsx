import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  MessageSquare, 
  Settings, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { WhatsAppService } from '../../services/whatsappService';
import { useOrganization } from '../../contexts/OrganizationContext';
import { 
  WhatsAppConfig, 
  AccountStatus, 
  ValidationResult,
  QUALITY_RATING_COLORS,
  ACCOUNT_STATUS_COLORS
} from '../../types/whatsapp';
import { BusinessProfileForm } from './BusinessProfileForm';
import { ManualSetupForm } from './ManualSetupForm';

export const WhatsAppSettingsPanel: React.FC = () => {
  const { organization } = useOrganization();
  const [config, setConfig] = React.useState<WhatsAppConfig | null>(null);
  const [, setAccountStatus] = React.useState<AccountStatus | null>(null);
  const [validation, setValidation] = React.useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSensitiveData, setShowSensitiveData] = React.useState(false);

  const loadWhatsAppData = React.useCallback(async () => {
    if (!organization?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [configData, statusData, validationData] = await Promise.allSettled([
        WhatsAppService.getWhatsAppSettings(organization.id),
        WhatsAppService.getAccountStatus(organization.id),
        WhatsAppService.validateConfiguration(organization.id),
      ]);

      if (configData.status === 'fulfilled') {
        setConfig(configData.value);
      }

      if (statusData.status === 'fulfilled') {
        setAccountStatus(statusData.value);
      }

      if (validationData.status === 'fulfilled') {
        setValidation(validationData.value);
      }

      // If any of the calls failed, it might mean WhatsApp is not configured
      if (configData.status === 'rejected' && 
          statusData.status === 'rejected' && 
          validationData.status === 'rejected') {
        setConfig(null);
        setAccountStatus(null);
        setValidation(null);
      }

    } catch (error: any) {
      console.error('Failed to load WhatsApp data:', error);
      setError('Failed to load WhatsApp configuration');
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id]);

  React.useEffect(() => {
    loadWhatsAppData();
  }, [loadWhatsAppData]);

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadWhatsAppData();
    setIsRefreshing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  const maskSensitiveData = (data: string) => {
    if (!data) return 'Not configured';
    if (showSensitiveData) return data;
    return data.slice(0, 4) + '•'.repeat(Math.max(0, data.length - 8)) + data.slice(-4);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading WhatsApp settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Business
          </CardTitle>
          <CardDescription>
            Connect your WhatsApp Business account to start messaging customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">WhatsApp Not Connected</h3>
              <p className="text-muted-foreground">
                Set up WhatsApp Business integration to communicate with your customers directly.
              </p>
            </div>
            <ManualSetupForm 
              onSetupComplete={loadWhatsAppData}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WhatsApp Business</h2>
          <p className="text-muted-foreground">
            Manage your WhatsApp Business integration and settings.
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Validation Alerts */}
      {validation && (
        <>
          {validation.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Configuration Issues:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {validation.warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Warnings:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Status Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Connected</div>
                <p className="text-xs text-muted-foreground">
                  WhatsApp Business API
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phone Number</CardTitle>
                <Phone className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{config.display_phone_number || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  {config.verified_name || 'Unverified'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Rating</CardTitle>
                <div className={`h-2 w-2 rounded-full ${
                  config.quality_rating === 'GREEN' ? 'bg-green-500' :
                  config.quality_rating === 'YELLOW' ? 'bg-yellow-500' :
                  config.quality_rating === 'RED' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="secondary"
                  className={QUALITY_RATING_COLORS[config.quality_rating as keyof typeof QUALITY_RATING_COLORS] || QUALITY_RATING_COLORS.UNKNOWN}
                >
                  {config.quality_rating || 'Unknown'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Message quality score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <Settings className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="secondary"
                  className={ACCOUNT_STATUS_COLORS[config.account_review_status as keyof typeof ACCOUNT_STATUS_COLORS] || ACCOUNT_STATUS_COLORS.UNKNOWN}
                >
                  {config.account_review_status || 'Unknown'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Business verification
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Details about your WhatsApp Business Account configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">WABA ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {config.waba_id || 'Not configured'}
                      </code>
                      {config.waba_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(config.waba_id!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Phone Number ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {config.phone_number_id || 'Not configured'}
                      </code>
                      {config.phone_number_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(config.phone_number_id!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Messaging Limit</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.messaging_limit_tier || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Name Status</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.name_status || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Number Status</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.number_status || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Setup Type</Label>
                    <Badge variant="outline" className="mt-1">
                      {config.is_embedded_signup ? 'Embedded Signup' : 'Manual Setup'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          {organization?.id && (
            <BusinessProfileForm
              organizationId={organization.id}
              initialData={config.business_profile}
              onSave={loadWhatsAppData}
              showSkip={false}
            />
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Technical Configuration</CardTitle>
                  <CardDescription>
                    Advanced settings and API configuration details.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                >
                  {showSensitiveData ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These are sensitive configuration details. Only share with authorized personnel.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">App ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {maskSensitiveData(config.app_id || '')}
                      </code>
                      {config.app_id && showSensitiveData && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(config.app_id!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Access Token</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {maskSensitiveData(config.access_token || '')}
                      </code>
                      {config.access_token && showSensitiveData && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(config.access_token!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Webhook URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {`${window.location.origin}/api/webhook/whatsapp/${organization?.slug}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${window.location.origin}/api/webhook/whatsapp/${organization?.slug}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Verify Token</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {organization?.slug}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(organization?.slug || '')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://developers.facebook.com/apps" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Meta Developer Console
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
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
            </CardContent>
          </Card>

          {/* Reconfigure Option */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Actions that can permanently affect your WhatsApp integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Reconfigure WhatsApp</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    This will disconnect your current WhatsApp Business account and start the setup process again.
                  </p>
                  <ManualSetupForm 
                    onSetupComplete={loadWhatsAppData}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for labels
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

export default WhatsAppSettingsPanel;