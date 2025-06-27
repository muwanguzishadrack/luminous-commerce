import React, { useState, useEffect } from 'react'
import { useOrganization } from '../../contexts/OrganizationContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { Upload, Image, Trash2 } from 'lucide-react'
import { UploadService } from '../../services/uploadService'
import { UpdateOrganizationRequest } from '../../types/organization'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

const GeneralSettings: React.FC = () => {
  const { organization, isLoading, error, updateOrganization } = useOrganization()
  const [uploading, setUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<UpdateOrganizationRequest>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        description: organization.description || '',
        address: organization.address || '',
        city: organization.city || '',
        state: organization.state || '',
        zipCode: organization.zipCode || '',
        timezone: organization.timezone || '',
      })
    }
  }, [organization])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (error || !organization) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load organization details</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof UpdateOrganizationRequest, value: string | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const timezones = [
    // East Africa (UTC+3) - Uganda, Kenya, Tanzania
    { value: 'Africa/Kampala', label: 'Uganda (UTC+3)' },
    { value: 'Africa/Nairobi', label: 'Kenya (UTC+3)' },
    { value: 'Africa/Dar_es_Salaam', label: 'Tanzania (UTC+3)' },
    
    // Central Africa (UTC+2) - Rwanda, Burundi
    { value: 'Africa/Kigali', label: 'Rwanda (UTC+2)' },
    { value: 'Africa/Bujumbura', label: 'Burundi (UTC+2)' },
    
    // West Africa (UTC+1) - Nigeria
    { value: 'Africa/Lagos', label: 'Nigeria (UTC+1)' },
    
    // West Africa (UTC+0) - Ghana
    { value: 'Africa/Accra', label: 'Ghana (UTC+0)' },
    
    // Southern Africa (UTC+2) - South Africa
    { value: 'Africa/Johannesburg', label: 'South Africa (UTC+2)' },
  ]


  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = UploadService.validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file format')
      return
    }

    setUploading(true)
    try {
      const logoUrl = await UploadService.uploadLogo(file)
      await updateOrganization({ logo: logoUrl })
      toast.success('Logo uploaded successfully!')
    } catch (error) {
      console.error('Failed to upload logo:', error)
      toast.error('Failed to upload logo. Please try again.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleLogoDelete = async () => {
    setUploading(true)
    try {
      await UploadService.deleteLogo()
      await updateOrganization({ logo: undefined })
      toast.success('Logo deleted successfully!')
    } catch (error) {
      console.error('Failed to delete logo:', error)
      toast.error('Failed to delete logo. Please try again.')
    } finally {
      setUploading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateOrganization(formData)
      toast.success('Organization details updated successfully!')
    } catch (error) {
      console.error('Failed to update organization:', error)
      toast.error('Failed to update organization. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <div className="mx-auto max-h-full max-w-4xl space-y-6 overflow-y-auto">
      {/* Organization Information Section - Logo, Name, Description */}
      <div className="rounded-lg bg-card p-6">
        <h3 className="mb-4 text-base font-semibold text-foreground">Organization Information</h3>
        
        {/* Logo */}
        <div className="mb-6 flex items-start gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
            {organization.logo ? (
              <img
                src={organization.logo}
                alt="Organization logo"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-muted-foreground">
              Recommended size: 200x200px. Supports JPEG, PNG, GIF up to 5MB.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  className="gap-2 rounded-xl"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : organization.logo ? 'Change Logo' : 'Upload Logo'}
                  </span>
                </Button>
              </Label>
              {organization.logo && (
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      className="gap-2 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Logo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the organization logo? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={uploading}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogoDelete}
                        disabled={uploading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {uploading ? 'Deleting...' : 'Delete Logo'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>

        {/* Organization Name */}
        <div className="mb-4">
          <h3 className="mb-4 text-sm font-medium text-foreground">Organization Name</h3>
          <Input
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter organization name"
            className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-foreground">Description</h3>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter organization description"
            rows={4}
            className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Address & Location Section */}
      <div className="rounded-lg bg-card p-6">
        <h3 className="mb-4 text-base font-semibold text-foreground">Address & Location</h3>
        <div className="space-y-6">
          {/* Row 1: Physical Address, State */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">Physical Address</h3>
              <Input
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter physical address"
                className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">State/Province</h3>
              <Input
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter state/province"
                className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Row 2: City, Zip Code */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">City</h3>
              <Input
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">Zip/Postal Code</h3>
              <Input
                value={formData.zipCode || ''}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="Enter zip/postal code"
                className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Row 3: Timezone */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">Timezone</h3>
              <Select 
                value={formData.timezone || ''} 
                onValueChange={(value) => handleInputChange('timezone', value)}
              >
                <SelectTrigger className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>


      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

export default GeneralSettings