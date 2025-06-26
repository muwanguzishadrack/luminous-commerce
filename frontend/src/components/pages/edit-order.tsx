import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Search, Plus, X, ShoppingCart, Trash2, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'

// Mock data for customers (same as Add Order)
const mockCustomers = [
  { id: 1, name: 'John Smith', phone: '+1 234 567 8901' },
  { id: 2, name: 'Sarah Johnson', phone: '+1 234 567 8902' },
  { id: 3, name: 'Mike Davis', phone: '+1 234 567 8903' },
  { id: 4, name: 'Emily Brown', phone: '+1 234 567 8904' },
]

// Mock data for products (same as Add Order)
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.5,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: 4,
    name: 'Phone Case',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: 5,
    name: 'USB Cable',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop&crop=center',
  },
]

// Mock order data to pre-populate the form
const mockOrderToEdit = {
  id: 'ORD-001',
  customer: { id: 1, name: 'John Smith', phone: '+1 234 567 8901' },
  products: [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 299.99,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 4,
      name: 'Phone Case',
      price: 89.99,
      quantity: 2,
      image:
        'https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop&crop=center',
    },
  ],
  paymentMethod: 'card',
  status: 'paid',
  discountType: 'fixed',
  discountValue: 50,
}

interface EditOrderProps {
  orderId: string
  onBack: () => void
  onDelete?: (orderId: string) => void
}

export function EditOrder({ orderId, onBack, onDelete }: EditOrderProps) {
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [status, setStatus] = useState('pending')
  const [discountType, setDiscountType] = useState('none')
  const [discountValue, setDiscountValue] = useState(0)

  // Pre-populate form with existing order data
  useEffect(() => {
    const orderToEdit = mockOrderToEdit // In real app, fetch by orderId
    setSelectedCustomer(orderToEdit.customer)
    setSelectedProducts(orderToEdit.products)
    setPaymentMethod(orderToEdit.paymentMethod)
    setStatus(orderToEdit.status)
    setDiscountType(orderToEdit.discountType)
    setDiscountValue(orderToEdit.discountValue)
  }, [orderId])

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch)
  )

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const addProduct = (product: any) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id)
    if (existingProduct) {
      setSelectedProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
      )
    } else {
      setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId)
    } else {
      setSelectedProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, quantity: newQuantity } : p))
      )
    }
  }

  const removeProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const subtotal = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )

  const discount =
    discountType === 'percentage'
      ? (subtotal * discountValue) / 100
      : discountType === 'fixed'
        ? discountValue
        : 0

  const total = subtotal - discount

  const handleCreateCustomer = () => {
    if (newCustomerName && newCustomerPhone) {
      const newCustomer = {
        id: Date.now(),
        name: newCustomerName,
        phone: newCustomerPhone,
      }
      setSelectedCustomer(newCustomer)
      setNewCustomerName('')
      setNewCustomerPhone('')
      setShowNewCustomer(false)
    }
  }

  const handleUpdateOrder = () => {
    // Handle order update logic here
    console.log('Order updated:', {
      orderId,
      customer: selectedCustomer,
      products: selectedProducts,
      paymentMethod,
      status,
      subtotal,
      discount,
      total,
    })
    // Navigate back or show success message
    onBack()
  }

  const handleDeleteOrder = () => {
    if (
      window.confirm('Are you sure you want to delete this order? This action cannot be undone.')
    ) {
      onDelete?.(orderId)
    }
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
          Back to Order
        </Button>
        <h2 className="text-xl font-medium tracking-tight text-gray-900">Edit Order {orderId}</h2>
      </div>

      <div className="grid gap-6">
        {/* Customer Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Customer</h3>

          {!showNewCustomer ? (
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customer name or phone"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                {/* Customer search results */}
                {customerSearch && !selectedCustomer && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-xl border bg-card shadow-lg">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setCustomerSearch('')
                          }}
                          className="cursor-pointer border-b p-3 transition-colors last:border-b-0 hover:bg-muted/50"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">No customers found</div>
                    )}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowNewCustomer(true)}
                className="gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Add New Customer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    placeholder="Enter phone number"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateCustomer}
                  disabled={!newCustomerName || !newCustomerPhone}
                  className="rounded-xl"
                  size="sm"
                >
                  Create Customer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewCustomer(false)}
                  className="rounded-xl"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Selected Customer */}
          {selectedCustomer && (
            <div className="mt-4 rounded-lg border bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{selectedCustomer.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedCustomer.phone}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="rounded-lg bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Products</h3>

            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl" size="sm">
                  <Plus className="h-4 w-4" />
                  Select Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Products</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  <div className="max-h-96 space-y-0 overflow-y-auto rounded-lg bg-muted/30 p-2">
                    {filteredProducts.map((product, index) => (
                      <div key={product.id}>
                        <div
                          onClick={() => {
                            addProduct(product)
                            setIsProductDialogOpen(false)
                          }}
                          className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">${product.price}</div>
                          </div>
                          <Button size="sm" className="rounded-xl">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {index < filteredProducts.length - 1 && (
                          <div className="mx-3 border-b border-border/50"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 ? (
            <div className="space-y-3">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">${product.price} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, product.quantity - 1)}
                      className="h-8 w-8 rounded-xl p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{product.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      className="h-8 w-8 rounded-xl p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="ml-2 rounded-xl text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No products added</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment & Status Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Payment & Status</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Order Summary</h3>

          <div className="space-y-4">
            {/* Discount Section */}
            <div className="space-y-3">
              <Label>Discount (Optional)</Label>
              <div className="flex gap-2">
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger className="w-40 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>

                {discountType !== 'none' && (
                  <Input
                    type="number"
                    placeholder={discountType === 'percentage' ? '0' : '0.00'}
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-32 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    min="0"
                    max={discountType === 'percentage' ? '100' : undefined}
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDeleteOrder}
            className="flex-1 rounded-xl text-destructive hover:text-destructive"
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Order
          </Button>
          <Button
            onClick={handleUpdateOrder}
            disabled={
              !selectedCustomer || selectedProducts.length === 0 || !paymentMethod || !status
            }
            className="flex-1 rounded-xl"
            size="sm"
          >
            Update Order
          </Button>
        </div>
      </div>
    </div>
  )
}
