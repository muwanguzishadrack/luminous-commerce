import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Copy, 
  ExternalLink, 
  Globe,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface WebhookConfig {
  webhookUrl: string;
  verifyToken: string;
}

interface WebhookInstructionsProps {
  className?: string;
}

export const WebhookInstructions: React.FC<WebhookInstructionsProps> = ({ className = '' }) => {
  const { organization } = useOrganization();
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebhookConfig = async () => {
      if (!organization?.id) return;

      try {
        const response = await fetch(`/api/whatsapp/webhook-config/${organization.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setWebhookConfig(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch webhook config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebhookConfig();
  }, [organization?.id]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading webhook configuration...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!webhookConfig) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load webhook configuration. Please ensure WhatsApp is properly set up.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Globe className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold">Webhook Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure these webhook settings in your Facebook Developer Console to receive messages.
        </p>
      </div>

      {/* Webhook Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Meta Webhook Settings
          </CardTitle>
          <CardDescription>
            Add these webhook settings to your Facebook Developer account under 
            WhatsApp → Configuration → Webhooks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Webhook URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Webhook URL</Label>
              <Badge variant="secondary">Required</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-md border">
                <code className="text-sm break-all text-gray-800">
                  {webhookConfig.webhookUrl}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookConfig.webhookUrl, 'url')}
              >
                {copiedField === 'url' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Verify Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Verify Token</Label>
              <Badge variant="secondary">Required</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-md border">
                <code className="text-sm text-gray-800">
                  {webhookConfig.verifyToken}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookConfig.verifyToken, 'token')}
              >
                {copiedField === 'token' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Setup</CardTitle>
          <CardDescription>
            Follow these steps to configure webhooks in your Facebook Developer Console.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-sm">Open Facebook Developer Console</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your app in the Facebook Developer Console and select WhatsApp product.
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Open Developer Console
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-sm">Navigate to Webhook Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Go to WhatsApp → Configuration → Webhooks section.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-sm">Add Webhook URL</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the Webhook URL above and paste it into the "Callback URL" field.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium text-sm">Add Verify Token</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the Verify Token above and paste it into the "Verify Token" field.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <div>
                <h4 className="font-medium text-sm">Subscribe to Webhook Events</h4>
                <p className="text-sm text-muted-foreground">
                  Enable webhook subscriptions for: messages, message_deliveries, message_reads, message_echoes.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <div>
                <h4 className="font-medium text-sm">Verify and Save</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Verify and Save" to complete the webhook setup.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Your webhook URL must be accessible from the internet and use HTTPS. 
          Make sure your server is running and the endpoint is configured correctly before verifying in Facebook.
        </AlertDescription>
      </Alert>
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

export default WebhookInstructions;