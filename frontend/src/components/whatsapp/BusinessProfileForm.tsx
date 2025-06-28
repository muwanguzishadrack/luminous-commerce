import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Loader2, Plus, X, AlertCircle, Info } from 'lucide-react';
import { WhatsAppService } from '../../services/whatsappService';
import { BusinessProfile, BusinessVertical, BUSINESS_VERTICALS } from '../../types/whatsapp';

const businessProfileSchema = z.object({
  about: z.string().max(139, 'About must be 139 characters or less').optional(),
  address: z.string().max(256, 'Address must be 256 characters or less').optional(),
  description: z.string().max(512, 'Description must be 512 characters or less').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  websites: z.array(z.string().url('Invalid website URL')).max(2, 'Maximum 2 websites allowed').optional(),
  vertical: z.enum([
    'UNDEFINED', 'OTHER', 'AUTO', 'BEAUTY', 'APPAREL', 'EDU', 'ENTERTAIN',
    'EVENT_PLAN', 'FINANCE', 'GROCERY', 'GOVT', 'HOTEL', 'HEALTH', 'NONPROFIT',
    'PROF_SERVICES', 'RETAIL', 'TRAVEL', 'RESTAURANT', 'NOT_A_BIZ'
  ] as const).optional(),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

interface BusinessProfileFormProps {
  organizationId: string;
  initialData?: BusinessProfile;
  onSave?: (data: BusinessProfileFormData) => void;
  onSkip?: () => void;
  onCancel?: () => void;
  showSkip?: boolean;
}

export const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({
  organizationId,
  initialData,
  onSave,
  onSkip,
  onCancel,
  showSkip = true,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [websites, setWebsites] = React.useState<string[]>(initialData?.websites || []);
  const [newWebsite, setNewWebsite] = React.useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      about: initialData?.about || '',
      address: initialData?.address || '',
      description: initialData?.description || '',
      email: initialData?.email || '',
      vertical: initialData?.vertical || 'OTHER',
      websites: initialData?.websites || [],
    },
  });

  const watchedFields = watch();

  // Update websites in form when state changes
  React.useEffect(() => {
    setValue('websites', websites);
  }, [websites, setValue]);

  const addWebsite = () => {
    if (newWebsite && websites.length < 2) {
      try {
        new URL(newWebsite); // Validate URL
        setWebsites([...websites, newWebsite]);
        setNewWebsite('');
      } catch {
        setError('Please enter a valid website URL');
      }
    }
  };

  const removeWebsite = (index: number) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Include websites in the submission data
      const submitData = { ...data, websites };

      await WhatsAppService.updateBusinessProfile(organizationId, submitData);
      onSave?.(submitData);
    } catch (error: any) {
      setError(error.message || 'Failed to update business profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const getCharacterCount = (value: string | undefined, maxLength: number) => {
    const length = value?.length || 0;
    return `${length}/${maxLength}`;
  };

  const getCharacterCountColor = (value: string | undefined, maxLength: number) => {
    const length = value?.length || 0;
    const percentage = (length / maxLength) * 100;
    
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>
          Customize your business profile to help customers recognize and trust your messages.
          All fields are optional, but a complete profile improves customer confidence.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* About */}
          <div className="space-y-2">
            <Label htmlFor="about">About Your Business</Label>
            <div className="relative">
              <Textarea
                id="about"
                placeholder="Brief description of what your business does..."
                {...register('about')}
                className="resize-none"
                rows={3}
              />
              <div className={`absolute bottom-2 right-2 text-xs ${
                getCharacterCountColor(watchedFields.about, 139)
              }`}>
                {getCharacterCount(watchedFields.about, 139)}
              </div>
            </div>
            {errors.about && (
              <p className="text-sm text-red-500">{errors.about.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              A short description that appears in your business profile.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Detailed description of your products, services, and what makes your business unique..."
                {...register('description')}
                className="resize-none"
                rows={4}
              />
              <div className={`absolute bottom-2 right-2 text-xs ${
                getCharacterCountColor(watchedFields.description, 512)
              }`}>
                {getCharacterCount(watchedFields.description, 512)}
              </div>
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              A more detailed description of your business for the WhatsApp Business directory.
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="123 Main St, City, State, Country"
                {...register('address')}
              />
              <div className={`absolute top-2 right-2 text-xs ${
                getCharacterCountColor(watchedFields.address, 256)
              }`}>
                {getCharacterCount(watchedFields.address, 256)}
              </div>
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your business address that customers can see in your profile.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="business@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              A contact email address for your business.
            </p>
          </div>

          {/* Business Vertical */}
          <div className="space-y-2">
            <Label htmlFor="vertical">Business Category</Label>
            <Select
              value={watchedFields.vertical}
              onValueChange={(value: BusinessVertical) => setValue('vertical', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your business category" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_VERTICALS.map((vertical) => (
                  <SelectItem key={vertical.value} value={vertical.value}>
                    {vertical.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vertical && (
              <p className="text-sm text-red-500">{errors.vertical.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Choose the category that best describes your business.
            </p>
          </div>

          {/* Websites */}
          <div className="space-y-2">
            <Label>Business Websites</Label>
            
            {/* Existing websites */}
            {websites.length > 0 && (
              <div className="space-y-2">
                {websites.map((website, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex-1 justify-between">
                      <span className="truncate">{website}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWebsite(index)}
                        className="ml-2 h-4 w-4 p-0 hover:bg-red-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Add new website */}
            {websites.length < 2 && (
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.example.com"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addWebsite();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWebsite}
                  disabled={!newWebsite.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {errors.websites && (
              <p className="text-sm text-red-500">{errors.websites.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Add up to 2 websites associated with your business.
            </p>
          </div>

          {/* Character limit info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Character limits are enforced by WhatsApp to ensure optimal display across all devices.
              Longer descriptions may be truncated in some contexts.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>

            {showSkip && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={isLoading}
              >
                Skip for Now
              </Button>
            )}

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>

          {isDirty && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Make sure to save your profile before leaving this page.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileForm;