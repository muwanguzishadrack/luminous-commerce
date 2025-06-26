import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Clock,
  Package,
  CreditCard,
  User,
  Phone,
  Printer,
  Edit,
  CheckCircle,
} from 'lucide-react'

// Mock data for detailed order
const mockOrderDetails = {
  id: 'ORD-001',
  customer: {
    name: 'John Smith',
    phone: '+1 234 567 8901',
  },
  orderDate: '2024-01-15',
  orderTime: '2:30 PM',
  status: 'paid',
  paymentMethod: 'Credit Card',
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
      id: 2,
      name: 'Phone Case',
      price: 89.99,
      quantity: 2,
      image:
        'https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop&crop=center',
    },
  ],
  subtotal: 479.97,
  discount: 50.0,
  delivery: 15.0,
  total: 444.97,
}

interface SingleOrderProps {
  orderId: string
  onBack: () => void
  onEdit?: (orderId: string) => void
}

export function SingleOrder({ orderId, onBack, onEdit }: SingleOrderProps) {
  const order = mockOrderDetails // In real app, fetch by orderId

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    }
  }

  const getDisplayStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleEdit = () => {
    onEdit?.(orderId)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 rounded-xl p-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <h2 className="text-xl font-medium tracking-tight text-gray-900">Order {order.id}</h2>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleEdit} className="gap-2 rounded-xl" size="sm">
            <Edit className="h-4 w-4" />
            Edit Order
          </Button>
          <Button
            variant="outline"
            onClick={handlePrintReceipt}
            className="gap-2 rounded-xl"
            size="sm"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Summary and Customer Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Order Summary - Takes 2/3 of space */}
          <div className="rounded-lg bg-card p-6 lg:col-span-2">
            <h3 className="mb-4 text-base font-semibold text-foreground">Order Summary</h3>

            {/* First Row - Order Time and Products */}
            <div className="mb-4">
              <div className="flex items-start gap-6">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-muted-foreground">Order Time</div>
                    <div className="text-sm font-medium">
                      {order.orderDate} at {order.orderTime}
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                    <Package className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-muted-foreground">Products</div>
                    <div className="text-sm font-medium">{order.products.length} items</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row - Total Amount and Status */}
            <div className="mt-4">
              <div className="flex items-start gap-6">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                    <CreditCard className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                    <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-muted-foreground">Status</div>
                    <div className="text-sm font-medium">
                      <Badge className={getStatusStyles(order.status)}>
                        {getDisplayStatus(order.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Section - Takes 1/3 of space */}
          <div className="rounded-lg bg-card p-6">
            <h3 className="mb-4 text-base font-semibold text-foreground">Customer Information</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Customer Name</div>
                  <div className="text-sm font-medium">{order.customer.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <Phone className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Phone Number</div>
                  <div className="text-sm font-medium">{order.customer.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Products</h3>

          <div className="space-y-4">
            {order.products.map((product, index) => (
              <div key={product.id}>
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} each
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="text-sm font-medium">{product.quantity}</div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-sm font-medium">
                      ${(product.price * product.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
                {index < order.products.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Order Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Delivery:</span>
              <span>${order.delivery.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
