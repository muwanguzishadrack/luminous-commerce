import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  MessageSquare, 
  Phone, 
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { WhatsAppService } from '../../services/whatsappService';
import { useOrganization } from '../../contexts/OrganizationContext';
import { 
  SetupStep, 
  SETUP_STEPS, 
  SetupProgress, 
  WhatsAppConfig,
  QUALITY_RATING_COLORS,
  ACCOUNT_STATUS_COLORS
} from '../../types/whatsapp';
import { ManualSetupForm } from './ManualSetupForm';
import { BusinessProfileForm } from './BusinessProfileForm';

interface WhatsAppSetupWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const WhatsAppSetupWizard: React.FC<WhatsAppSetupWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const { organization } = useOrganization();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [steps, setSteps] = React.useState<SetupStep[]>(SETUP_STEPS);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [config, setConfig] = React.useState<WhatsAppConfig | null>(null);
  const [, setProgress] = React.useState<SetupProgress | null>(null);

  // Load current configuration and progress
  React.useEffect(() => {
    const loadSetupData = async () => {
      if (!organization?.id) return;

      setIsLoading(true);
      try {
        const [setupProgress, whatsappConfig] = await Promise.allSettled([
          WhatsAppService.getSetupProgress(organization.id),
          WhatsAppService.getWhatsAppSettings(organization.id).catch(() => null),
        ]);

        if (setupProgress.status === 'fulfilled') {
          setProgress(setupProgress.value);
          updateStepsBasedOnProgress(setupProgress.value);
        }

        if (whatsappConfig.status === 'fulfilled' && whatsappConfig.value) {
          setConfig(whatsappConfig.value);
        }

      } catch (error: any) {
        console.error('Failed to load setup data:', error);
        setError('Failed to load setup information');
      } finally {
        setIsLoading(false);
      }
    };

    loadSetupData();
  }, [organization?.id]);

  const updateStepsBasedOnProgress = (setupProgress: SetupProgress) => {
    const updatedSteps = SETUP_STEPS.map((step, index) => {
      switch (step.id) {
        case 'start':
          return { ...step, completed: true, current: false };
        case 'oauth':
          return { 
            ...step, 
            completed: setupProgress.isConfigured, 
            current: !setupProgress.isConfigured && index === currentStep 
          };
        case 'phone':
          return { 
            ...step, 
            completed: setupProgress.hasPhoneNumber, 
            current: setupProgress.isConfigured && !setupProgress.hasPhoneNumber && index === currentStep 
          };
        case 'profile':
          return { 
            ...step, 
            completed: setupProgress.hasBusinessProfile, 
            current: setupProgress.hasPhoneNumber && !setupProgress.hasBusinessProfile && index === currentStep 
          };
        case 'complete':
          return { 
            ...step, 
            completed: setupProgress.isConfigured && setupProgress.hasPhoneNumber, 
            current: setupProgress.isConfigured && setupProgress.hasPhoneNumber 
          };
        default:
          return step;
      }
    });

    setSteps(updatedSteps);

    // Update current step based on progress
    if (!setupProgress.isConfigured) {
      setCurrentStep(1); // OAuth step
    } else if (!setupProgress.hasPhoneNumber) {
      setCurrentStep(2); // Phone step
    } else if (!setupProgress.hasBusinessProfile) {
      setCurrentStep(3); // Profile step
    } else {
      setCurrentStep(4); // Complete step
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSetupComplete = () => {
    setCurrentStep(4); // Complete step
    onComplete?.();
  };

  const refreshSetupData = async () => {
    if (!organization?.id) return;

    setIsLoading(true);
    try {
      const [setupProgress, whatsappConfig] = await Promise.all([
        WhatsAppService.getSetupProgress(organization.id),
        WhatsAppService.getWhatsAppSettings(organization.id),
      ]);

      setProgress(setupProgress);
      setConfig(whatsappConfig);
      updateStepsBasedOnProgress(setupProgress);

    } catch (error: any) {
      console.error('Failed to refresh setup data:', error);
      setError('Failed to refresh setup information');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'start':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect WhatsApp Business</h3>
                <p className="text-muted-foreground">
                  Integrate your WhatsApp Business account to start messaging customers directly.
                </p>
              </div>
            </div>

            <div className="space-y-4">
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
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Rich media support (images, documents, etc.)</span>
                </li>
              </ul>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You'll need a Meta Business account and WhatsApp Business Account (WABA) to continue.
                Don't worry - we'll guide you through the process.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'oauth':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect Your Account</h3>
                <p className="text-muted-foreground">
                  Enter your WhatsApp Business API credentials to connect your account.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ManualSetupForm 
                onSetupComplete={handleSetupComplete}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter your WhatsApp Business API credentials to connect your account. 
                You can find these in your Meta Developer Console and WhatsApp Manager.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Phone Number Configured</h3>
                <p className="text-muted-foreground">
                  Your WhatsApp Business phone number has been set up successfully.
                </p>
              </div>
            </div>

            {config && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Phone Number:</span>
                    <span className="text-sm">{config.display_phone_number || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Verified Name:</span>
                    <span className="text-sm">{config.verified_name || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quality Rating:</span>
                    <Badge 
                      variant="secondary" 
                      className={QUALITY_RATING_COLORS[config.quality_rating as keyof typeof QUALITY_RATING_COLORS] || QUALITY_RATING_COLORS.UNKNOWN}
                    >
                      {config.quality_rating || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Status:</span>
                    <Badge 
                      variant="secondary"
                      className={ACCOUNT_STATUS_COLORS[config.account_review_status as keyof typeof ACCOUNT_STATUS_COLORS] || ACCOUNT_STATUS_COLORS.UNKNOWN}
                    >
                      {config.account_review_status || 'Unknown'}
                    </Badge>
                  </div>
                </div>

                <Button onClick={refreshSetupData} variant="outline" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    'Refresh Status'
                  )}
                </Button>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Business Profile</h3>
                <p className="text-muted-foreground">
                  Complete your business profile to help customers recognize and trust your messages.
                </p>
              </div>
            </div>

            {organization?.id && (
              <BusinessProfileForm
                organizationId={organization.id}
                initialData={config?.business_profile}
                onSave={nextStep}
                onSkip={nextStep}
              />
            )}
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Setup Complete!</h3>
                <p className="text-muted-foreground">
                  Your WhatsApp Business integration is ready. You can now start messaging customers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Next Steps:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start conversations with customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Create message templates for faster responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set up automated replies</span>
                </li>
              </ul>
            </div>

            <Button onClick={onComplete} className="w-full" size="lg">
              Go to WhatsApp Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && !config) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading setup information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Business Setup
            </CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
            </CardDescription>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={getProgressPercentage()} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{steps.filter(s => s.completed).length} of {steps.length} completed</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.current 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-16 truncate">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length - 1 && (
            <Button
              onClick={nextStep}
              disabled={!steps[currentStep].completed || isLoading}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSetupWizard;