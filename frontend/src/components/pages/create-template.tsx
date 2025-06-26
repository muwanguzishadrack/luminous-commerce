import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, MessageSquare, Phone, Reply, ArrowLeft } from 'lucide-react'

interface TemplateFormData {
  category: string
  language: string
  name: string
  type: string
  format: string
  footer: string
  interactiveActions: string
}

interface CreateTemplateProps {
  onBack?: () => void
}

export function CreateTemplate({ onBack }: CreateTemplateProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    category: '',
    language: '',
    name: '',
    type: '',
    format: '',
    footer: '',
    interactiveActions: 'none',
  })

  const [errors, setErrors] = useState<Partial<TemplateFormData>>({})

  const handleInputChange = (field: keyof TemplateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<TemplateFormData> = {}

    if (!formData.category) newErrors.category = 'Template category is required'
    if (!formData.language) newErrors.language = 'Template language is required'
    if (!formData.name) {
      newErrors.name = 'Template name is required'
    } else if (!/^[a-z0-9_]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain lowercase alphanumeric characters and underscores'
    }
    if (!formData.type) newErrors.type = 'Template type is required'
    if (!formData.format) {
      newErrors.format = 'Template format is required'
    } else if (formData.format.length > 1024) {
      newErrors.format = 'Template format cannot exceed 1024 characters'
    }
    if (formData.footer && formData.footer.length > 60) {
      newErrors.footer = 'Footer cannot exceed 60 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Handle form submission here
      if (onBack) {
        onBack()
      }
    }
  }

  const formatPreviewText = (text: string) => {
    return text
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/~([^~]+)~/g, '<del>$1</del>')
      .replace(
        /\{\{(\d+)\}\}/g,
        '<span class="bg-blue-100 text-blue-800 px-1 rounded">{{$1}}</span>'
      )
  }

  const getPreviewIcon = () => {
    switch (formData.type) {
      case 'Text':
        return <MessageSquare className="h-5 w-5 text-green-600" />
      case 'Image':
        return <div className="h-5 w-5 rounded bg-gray-300" />
      case 'Video':
        return <div className="h-5 w-5 rounded bg-red-300" />
      case 'Document':
        return <div className="h-5 w-5 rounded bg-blue-300" />
      case 'Location':
        return <div className="h-5 w-5 rounded bg-green-300" />
      case 'Carousel':
        return <div className="h-5 w-5 rounded bg-purple-300" />
      default:
        return <MessageSquare className="h-5 w-5 text-gray-400" />
    }
  }

  const renderInteractiveActions = () => {
    if (
      formData.interactiveActions === 'call-to-actions' ||
      formData.interactiveActions === 'all'
    ) {
      return (
        <div className="mt-3 space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </Button>
        </div>
      )
    }
    if (formData.interactiveActions === 'quick-reply' || formData.interactiveActions === 'all') {
      return (
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer">
            <Reply className="mr-1 h-3 w-3" />
            Yes
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            <Reply className="mr-1 h-3 w-3" />
            No
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            <Reply className="mr-1 h-3 w-3" />
            Maybe
          </Badge>
        </div>
      )
    }
    return null
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 rounded-xl p-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
        <h2 className="text-xl font-medium tracking-tight text-gray-900">Create Template</h2>
      </div>

      <div className="grid gap-6">
        {/* Form Section */}
        <div className="rounded-lg bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Category and Language Row */}
            <div className="space-y-4">
              {/* Labels and Descriptions */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Template Category
                  </Label>
                  <p className="text-xs text-gray-600">
                    Your template should fall under one of these categories
                  </p>
                </div>
                <div>
                  <Label htmlFor="language" className="text-sm font-medium">
                    Template Language
                  </Label>
                  <p className="text-xs text-gray-600">
                    You will need to specify the language in which message template is submitted.
                  </p>
                </div>
              </div>

              {/* Dropdowns on same line */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select message category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select message language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {errors.language}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Template Name
              </Label>
              <p className="text-xs text-gray-600">
                Name can only be in lowercase alphanumeric characters and underscores. Special
                characters and white-space are not allowed
              </p>
              <Input
                id="name"
                placeholder="e.g. - app_verification_code"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Template Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Template Type</Label>
              <p className="text-xs text-gray-600">
                Your template type should fall under one of these categories.
              </p>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="Image">Image</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Location">Location</SelectItem>
                  <SelectItem value="Carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type}
                </p>
              )}
            </div>

            {/* Template Format */}
            <div className="space-y-2">
              <Label htmlFor="format" className="text-sm font-medium">
                Template Format
              </Label>
              <p className="text-xs text-gray-600">
                Use text formatting - *bold*, _italic_ & ~strikethrough~
                <br />
                Your message content. Upto 1024 characters are allowed.
              </p>
              <Textarea
                id="format"
                placeholder="e.g. - Hello {{1}}, your code will expire in {{2}} mins."
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                className={`min-h-[120px] ${errors.format ? 'border-red-500' : ''}`}
                maxLength={1024}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formData.format.length}/1024 characters
                </span>
                {errors.format && (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.format}
                  </p>
                )}
              </div>
            </div>

            {/* Template Footer */}
            <div className="space-y-2">
              <Label htmlFor="footer" className="text-sm font-medium">
                Template Footer (Optional)
              </Label>
              <p className="text-xs text-gray-600">
                Your message content. Upto 60 characters are allowed.
              </p>
              <Input
                id="footer"
                placeholder="Footer text..."
                value={formData.footer}
                onChange={(e) => handleInputChange('footer', e.target.value)}
                className={errors.footer ? 'border-red-500' : ''}
                maxLength={60}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formData.footer.length}/60 characters
                </span>
                {errors.footer && (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.footer}
                  </p>
                )}
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Interactive Actions</Label>
              <p className="text-xs text-gray-600">
                In addition to your message, you can send actions with your message.
                <br />
                Maximum 25 characters are allowed in CTA button title & Quick Replies.
              </p>
              <RadioGroup
                value={formData.interactiveActions}
                onValueChange={(value) => handleInputChange('interactiveActions', value)}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="call-to-actions" id="call-to-actions" />
                  <Label htmlFor="call-to-actions">Call to Actions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick-reply" id="quick-reply" />
                  <Label htmlFor="quick-reply">Quick Reply</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
              </RadioGroup>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Template Preview</h3>
          <p className="mb-4 text-sm text-gray-600">
            Your template message preview. It will update as you fill in the values in the form.
          </p>

          {/* Preview Container */}
          <div className="min-h-[300px] rounded-lg bg-gray-50 p-4">
            {formData.format || formData.footer ? (
              <div className="max-w-sm rounded-lg border bg-white p-4 shadow-sm">
                {/* Message Header */}
                <div className="mb-3 flex items-center gap-2">
                  {getPreviewIcon()}
                  <span className="text-sm font-medium text-gray-700">
                    {formData.type || 'Message'}
                  </span>
                  {formData.category && (
                    <Badge variant="secondary" className="text-xs">
                      {formData.category}
                    </Badge>
                  )}
                </div>

                {/* Message Content */}
                {formData.format && (
                  <div
                    className="mb-3 text-sm leading-relaxed text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: formatPreviewText(formData.format),
                    }}
                  />
                )}

                {/* Interactive Actions */}
                {renderInteractiveActions()}

                {/* Footer */}
                {formData.footer && (
                  <>
                    <Separator className="my-3" />
                    <div className="text-xs text-gray-500">{formData.footer}</div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p className="text-sm">Start filling the form to see your template preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">
              <strong>Disclaimer:</strong> This is just a graphical representation of the message
              that will be delivered. Actual message will consist of media selected and may appear
              different.
            </p>
          </div>

          {/* Template Info */}
          {(formData.name || formData.language) && (
            <div className="mt-4 space-y-2">
              {formData.name && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Template Name:</span>
                  <span className="font-mono text-gray-900">{formData.name}</span>
                </div>
              )}
              {formData.language && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Language:</span>
                  <span className="text-gray-900">{formData.language}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Template</Button>
        </div>
      </div>
    </div>
  )
}
