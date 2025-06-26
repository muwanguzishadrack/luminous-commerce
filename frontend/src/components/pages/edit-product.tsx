import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Upload, X, Image as ImageIcon, Check, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

// Mock media library images
const mockMediaLibrary = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center',
    name: 'Wireless Headphones',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center',
    name: 'Smart Watch',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center',
    name: 'Bluetooth Speaker',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=200&fit=crop&crop=center',
    name: 'Phone Case',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop&crop=center',
    name: 'USB Cable',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop&crop=center',
    name: 'Gaming Mouse',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
    name: 'Desk Lamp',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200&h=200&fit=crop&crop=center',
    name: 'Webcam',
  },
]

// Mock product data for editing
const mockProductData = {
  id: 'PRD-001',
  name: 'Wireless Headphones',
  description:
    'High-quality wireless headphones with noise cancellation and premium sound quality.',
  category: 'Electronics',
  stock: '25',
  price: '299.99',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center',
  ],
}

interface EditProductProps {
  productId: string
  onBack: () => void
}

export function EditProduct({ productId, onBack }: EditProductProps) {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [mediaLibrary, setMediaLibrary] = useState(mockMediaLibrary)
  const [selectedLibraryImages, setSelectedLibraryImages] = useState<number[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [recentlyUploaded, setRecentlyUploaded] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = ['Electronics', 'Accessories', 'Home & Office']
  const maxFileSize = 5 * 1024 * 1024 // 5MB
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  // Load existing product data
  useEffect(() => {
    // In a real app, you would fetch product data by productId
    const product = mockProductData
    setProductName(product.name)
    setDescription(product.description)
    setCategory(product.category)
    setStock(product.stock)
    setPrice(product.price)
    setImages(product.images)
  }, [productId])

  const validateFile = (file: File) => {
    if (!supportedFormats.includes(file.type)) {
      alert(
        `Unsupported format. Please use: ${supportedFormats.map((f) => f.split('/')[1]).join(', ')}`
      )
      return false
    }
    if (file.size > maxFileSize) {
      alert(`File too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`)
      return false
    }
    return true
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const validFiles = Array.from(files).filter(validateFile)
      const newImages = validFiles.map((file) => {
        // In a real app, you would upload to a server and get URLs back
        const newImage = {
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(file),
          name: file.name.split('.')[0],
        }
        return newImage
      })

      // Add to media library
      setMediaLibrary((prev) => [...newImages, ...prev])
      setRecentlyUploaded((prev) => [...prev, ...newImages])

      // Automatically add uploaded images to product preview
      const newImageUrls = newImages.map((img) => img.url)
      setImages((prev) => [...prev, ...newImageUrls])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const toggleImageSelection = (imageId: number) => {
    setSelectedLibraryImages((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    )
  }

  const addSelectedImagesToProduct = () => {
    const selectedImages = mediaLibrary.filter((img) => selectedLibraryImages.includes(img.id))
    const imageUrls = selectedImages.map((img) => img.url)
    setImages((prev) => [...prev, ...imageUrls])
    setSelectedLibraryImages([])
    setIsMediaLibraryOpen(false)
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateProduct = () => {
    // Handle product update logic here
    console.log('Product updated:', {
      id: productId,
      name: productName,
      description,
      category,
      stock: parseInt(stock),
      price: parseFloat(price),
      images,
    })
    // Navigate back or show success message
    onBack()
  }

  const isFormValid = productName && category && stock && price

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
          Back to Product
        </Button>
        <h2 className="text-xl font-medium tracking-tight text-gray-900">Edit Product</h2>
      </div>

      <div className="grid gap-6">
        {/* Product Images Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Product Images</h3>

          <div className="space-y-4">
            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative h-32 w-32">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {/* Add More Images Placeholder */}
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <div
                      className="flex h-auto cursor-pointer flex-col items-center gap-1 rounded-xl p-3"
                      onClick={() => setIsMediaLibraryOpen(true)}
                    >
                      <Upload className="h-5 w-5 text-muted-foreground/60" />
                      <span className="text-xs text-muted-foreground">Add More</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Initial Upload Placeholder */}
            {images.length === 0 && (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer gap-2 rounded-xl"
                    onClick={() => setIsMediaLibraryOpen(true)}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    You can upload multiple images. Recommended size: 400x400px
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Media Library Dialog */}
          <Dialog open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen}>
            <DialogContent className="flex h-[80vh] max-w-6xl flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Media Library</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="select" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="select">Select Images</TabsTrigger>
                  <TabsTrigger value="upload">Upload New Images</TabsTrigger>
                </TabsList>

                {/* Select Images Tab */}
                <TabsContent value="select" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Click images to select them for your product
                    </p>
                    <div className="flex gap-2">
                      {selectedLibraryImages.length > 0 && (
                        <Button onClick={addSelectedImagesToProduct} size="sm" className="gap-2">
                          <Check className="h-4 w-4" />
                          Add Selected ({selectedLibraryImages.length})
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Image Grid */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="flex flex-wrap gap-4 p-1">
                      {mediaLibrary.map((image) => (
                        <div key={image.id} className="group relative cursor-pointer">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-32 w-32 rounded-lg object-cover transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
                          />

                          {/* Action Icons on the right */}
                          <div className="absolute right-1 top-1 z-10 flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant={
                                selectedLibraryImages.includes(image.id) ? 'default' : 'secondary'
                              }
                              onClick={() => toggleImageSelection(image.id)}
                              className="h-6 w-6 rounded-full p-0"
                            >
                              {selectedLibraryImages.includes(image.id) ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <div className="h-3 w-3 rounded-sm border border-current" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                setMediaLibrary((prev) => prev.filter((img) => img.id !== image.id))
                                setSelectedLibraryImages((prev) =>
                                  prev.filter((id) => id !== image.id)
                                )
                              }}
                              className="h-6 w-6 rounded-full p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Selected overlay */}
                          {selectedLibraryImages.includes(image.id) && (
                            <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-primary bg-primary/20"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {mediaLibrary.length === 0 && (
                      <div className="flex h-64 items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-40" />
                          <p className="text-lg font-medium">No images in library</p>
                          <p className="text-sm">Upload some images to get started</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Upload New Images Tab */}
                <TabsContent value="upload" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Upload new images to your media library
                    </p>
                    <div className="text-sm text-muted-foreground">
                      {mediaLibrary.length} images in library
                    </div>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
                    <p className="mb-1 text-base font-medium">Drag and drop images here</p>
                    <p className="mb-3 text-sm text-muted-foreground">or click to browse</p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </Button>

                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <p>Supported formats: JPEG, JPG, PNG, WebP</p>
                      <p>Maximum size: 5MB per file</p>
                    </div>
                  </div>

                  {/* Recently Uploaded Preview */}
                  {recentlyUploaded.length > 0 && (
                    <div className="rounded-lg bg-muted/30 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium">Recently Uploaded</span>
                        <span className="text-xs text-muted-foreground">
                          {recentlyUploaded.length} new images
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentlyUploaded.map((image) => (
                          <div key={image.id} className="relative">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="h-16 w-16 rounded object-cover"
                            />
                            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                              <Check className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRecentlyUploaded([])}
                        className="mt-2 text-xs"
                      >
                        Clear Preview
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Name Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Product Name</h3>
          <Input
            id="productName"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Description Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Description</h3>
          <Textarea
            id="description"
            placeholder="Enter product description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Category and Stock Quantity Section */}
        <div className="rounded-lg bg-card p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Category</h3>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Stock Quantity</h3>
              <Input
                id="stock"
                type="number"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Price</h3>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button
            onClick={handleUpdateProduct}
            disabled={!isFormValid}
            className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Update Product
          </Button>
        </div>
      </div>
    </div>
  )
}
