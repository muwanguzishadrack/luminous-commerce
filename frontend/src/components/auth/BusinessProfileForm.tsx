import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Upload, X } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { ApiError } from '../../lib/api';
import { uploadService } from '../../services/uploadService';

const businessProfileSchema = z.object({
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional(),
  state: z.string().max(100, 'State must be less than 100 characters').optional(),
  zipCode: z.string().max(20, 'Zip code must be less than 20 characters').optional(),
  country: z.string().max(100, 'Country must be less than 100 characters').optional(),
  currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
  timezone: z.string().max(50, 'Timezone must be less than 50 characters').optional(),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

interface BusinessProfileFormProps {
  isOptional?: boolean;
}

export const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({ isOptional = true }) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { updateOrganization } = useOrganization();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const validation = uploadService.validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      setLogoFile(file);
      setLogoPreview(uploadService.createPreviewUrl(file));
      setError(''); // Clear any previous errors
    }
  };

  const removeLogo = () => {
    if (logoPreview) {
      uploadService.revokePreviewUrl(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview('');
    setUploadProgress(0);
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      // First update the organization details
      await updateOrganization(data);
      
      // If there's a logo file, upload it
      if (logoFile) {
        try {
          await uploadService.uploadLogo(logoFile, (progress) => {
            setUploadProgress(progress);
          });
        } catch (uploadError) {
          console.warn('Logo upload failed:', uploadError);
          // Continue anyway - user can upload logo later
        }
      }
      
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete your business profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isOptional 
              ? "You can add these details now or skip and complete them later"
              : "Please provide your business details to continue"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Business logo (optional)</Label>
            <div className="flex items-center space-x-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Choose file
                </Label>
              </div>
            </div>
            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading logo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Business description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your business..."
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street address (optional)</Label>
              <Input
                id="address"
                {...register('address')}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City (optional)</Label>
                <Input
                  id="city"
                  {...register('city')}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province (optional)</Label>
                <Input
                  id="state"
                  {...register('state')}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal code (optional)</Label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country (optional)</Label>
                <Input
                  id="country"
                  {...register('country')}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Business Preferences</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency (optional)</Label>
                <Input
                  id="currency"
                  placeholder="USD"
                  maxLength={3}
                  {...register('currency')}
                  className={errors.currency ? 'border-red-500' : ''}
                />
                {errors.currency && (
                  <p className="text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone (optional)</Label>
                <Input
                  id="timezone"
                  placeholder="UTC"
                  {...register('timezone')}
                  className={errors.timezone ? 'border-red-500' : ''}
                />
                {errors.timezone && (
                  <p className="text-sm text-red-600">{errors.timezone.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete profile
            </Button>
            
            {isOptional && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={isLoading}
              >
                Skip for now
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};