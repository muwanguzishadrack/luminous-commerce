import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CountrySelect } from '../ui/country-select';
import { countries } from '../../constants/countries';
import { authService } from '../../services/authService';
import { ApiError } from '../../lib/api';
import { UpdateProfileRequest, ChangePasswordRequest } from '../../types/auth';

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
});

// Security form schema
const securitySchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type SecurityFormData = z.infer<typeof securitySchema>;

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileError, setProfileError] = useState<string>('');
  const [securityError, setSecurityError] = useState<string>('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === 'UG') || countries[0]);

  if (!user) {
    return null;
  }

  // Get current user's country from phone number or default to Uganda
  const getUserCountry = () => {
    if (!user?.phoneNumber) return countries.find(c => c.code === 'UG') || countries[0];
    
    try {
      // Try to match country by dial code
      const matchedCountry = countries.find(c => user.phoneNumber?.startsWith(c.dial_code));
      return matchedCountry || countries.find(c => c.code === 'UG') || countries[0];
    } catch (error) {
      console.error('Error in getUserCountry:', error);
      return countries.find(c => c.code === 'UG') || countries[0];
    }
  };

  useEffect(() => {
    if (user) {
      const userCountry = getUserCountry();
      setSelectedCountry(userCountry);
    }
  }, [user]);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  // Security form
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setProfileLoading(true);
      setProfileError('');
      
      const updateData: UpdateProfileRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };
      
      await authService.updateProfile(updateData);
      
      // Refresh user data in context
      if (refreshUser) {
        await refreshUser();
      }
      
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setProfileError(err.message);
      } else {
        setProfileError('Failed to update profile. Please try again.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const onSecuritySubmit = async (data: SecurityFormData) => {
    try {
      setSecurityLoading(true);
      setSecurityError('');
      
      const changePasswordData: ChangePasswordRequest = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      
      await authService.changePassword(changePasswordData);
      
      // Reset form and close dialog
      securityForm.reset();
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setSecurityError(err.message);
      } else {
        setSecurityError('Failed to change password. Please try again.');
      }
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleCancel = () => {
    if (activeTab === 'profile') {
      profileForm.reset();
      setProfileError('');
    } else {
      securityForm.reset();
      setSecurityError('');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] min-h-[520px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 outline-0">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account information and security settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full border-0 outline-0">
          <TabsList className="grid w-full grid-cols-2 bg-primary h-12 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
            <TabsTrigger value="profile" className="h-full data-[state=inactive]:text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">My Profile</TabsTrigger>
            <TabsTrigger value="security" className="h-full data-[state=inactive]:text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">Security</TabsTrigger>
          </TabsList>

          <TabsContent 
            value="profile" 
            className="space-y-4 mt-6 border-0 outline-0 focus:outline-0 focus:border-0 [&:focus-visible]:ring-0 [&:focus-visible]:outline-0 [&:focus]:ring-0 [&:focus]:outline-0"
            style={{ border: 'none', outline: 'none' }}
          >
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 border-0 outline-0 focus:outline-0 focus:border-0">
              {profileError && (
                <Alert variant="destructive">
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register('firstName')}
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-red-600">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    {...profileForm.register('lastName')}
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-red-600">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register('email')}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <div className="flex border border-input rounded-md">
                  <CountrySelect
                    value={selectedCountry.code}
                    onChange={() => {}} // Read-only
                    className="border-0 rounded-r-none border-r border-input focus:ring-0 focus:ring-offset-0 w-16 pointer-events-none opacity-75"
                  />
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {selectedCountry.dial_code}
                    </span>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={user?.phoneNumber || ''}
                      disabled
                      className="border-0 rounded-l-none pl-12 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent 
            value="security" 
            className="space-y-4 mt-6 border-0 outline-0 focus:outline-0 focus:border-0 [&:focus-visible]:ring-0 [&:focus-visible]:outline-0 [&:focus]:ring-0 [&:focus]:outline-0"
            style={{ border: 'none', outline: 'none' }}
          >
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4 border-0 outline-0 focus:outline-0 focus:border-0">
              {securityError && (
                <Alert variant="destructive">
                  <AlertDescription>{securityError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  {...securityForm.register('oldPassword')}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {securityForm.formState.errors.oldPassword && (
                  <p className="text-sm text-red-600">
                    {securityForm.formState.errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...securityForm.register('newPassword')}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {securityForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-600">
                    {securityForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...securityForm.register('confirmPassword')}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {securityForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {securityForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={securityLoading}>
                  {securityLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};