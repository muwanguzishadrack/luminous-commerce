import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Edit,
  Search,
  ChevronDown,
  Loader,
  Phone,
  Calendar,
  ShoppingCart,
  CreditCard,
  Package,
} from 'lucide-react'
import { useState } from 'react'

// Mock customer data
const mockCustomerDetails = {
  id: 'CUST-001',
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '+1 (555) 123-4567',
  dateJoined: '2024-01-15',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
  totalOrders: 8,
  totalPaidAmount: 2399.92,
  lastPurchaseDate: '2024-01-20',
}

// Mock orders for this customer
const mockCustomerOrders = [
  {
    id: 'ORD-001',
    amount: 299.99,
    products: ['Wireless Headphones'],
    status: 'Paid',
    createdAt: '2024-01-20',
  },
  {
    id: 'ORD-015',
    amount: 449.98,
    products: ['Smart Watch', 'Phone Case'],
    status: 'Paid',
    createdAt: '2024-01-18',
  },
  {
    id: 'ORD-028',
    amount: 199.99,
    products: ['Bluetooth Speaker'],
    status: 'Pending',
    createdAt: '2024-01-16',
  },
  {
    id: 'ORD-042',
    amount: 89.99,
    products: ['USB Cable'],
    status: 'Cancelled',
    createdAt: '2024-01-14',
  },
  {
    id: 'ORD-056',
    amount: 649.97,
    products: ['Gaming Mouse', 'Keyboard', 'Webcam'],
    status: 'Paid',
    createdAt: '2024-01-12',
  },
  {
    id: 'ORD-070',
    amount: 399.99,
    products: ['Monitor'],
    status: 'Paid',
    createdAt: '2024-01-10',
  },
  {
    id: 'ORD-084',
    amount: 179.99,
    products: ['Desk Lamp'],
    status: 'Paid',
    createdAt: '2024-01-08',
  },
  {
    id: 'ORD-098',
    amount: 129.99,
    products: ['Keyboard'],
    status: 'Paid',
    createdAt: '2024-01-06',
  },
]

interface SingleCustomerProps {
  customerId: string
  onBack: () => void
  onUpdateDetails: (customerId: string) => void
  onOrderSelect: (orderId: string) => void
}

export function SingleCustomer({
  customerId,
  onBack,
  onUpdateDetails,
  onOrderSelect,
}: SingleCustomerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const itemsPerPage = 5

  const customer = mockCustomerDetails // In real app, fetch by customerId

  // Filter orders based on search and status
  const filteredOrders = mockCustomerOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some((product) => product.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'All Statuses' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatProducts = (products: string[]) => {
    if (products.length === 1) {
      return products[0]
    } else if (products.length === 2) {
      return products.join(', ')
    } else {
      return `${products[0]}, ${products[1]} +${products.length - 2} more`
    }
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
            Back to Customers
          </Button>
          <h2 className="text-xl font-medium tracking-tight text-gray-900">{customer.name}</h2>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onUpdateDetails(customerId)}
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Edit className="h-4 w-4" />
            Update Details
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Customer Summary Section - Combined into one card */}
        <div className="rounded-lg bg-card p-6">
          {/* Customer Information Row */}
          <div className="mb-4">
            <h4 className="mb-4 text-base font-semibold text-foreground">Customer Information</h4>
            <div className="flex items-start gap-6">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30">
                  <span className="text-base font-medium text-secondary-foreground">
                    {customer.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Customer Name</div>
                  <div className="text-sm font-medium">{customer.name}</div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <Phone className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Phone Number</div>
                  <div className="text-sm font-medium">{customer.phone}</div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <Calendar className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Date Joined</div>
                  <div className="text-sm font-medium">{formatDate(customer.dateJoined)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Value Row */}
          <div className="border-t border-border pt-4">
            <h4 className="mb-4 text-base font-semibold text-foreground">Customer Value</h4>
            <div className="flex items-start gap-6">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <ShoppingCart className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Total Orders</div>
                  <div className="text-sm font-medium">{customer.totalOrders}</div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <CreditCard className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Total Paid Amount</div>
                  <div className="text-sm font-medium">
                    ${customer.totalPaidAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                  <Package className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-muted-foreground">Last Purchase Date</div>
                  <div className="text-sm font-medium">{formatDate(customer.lastPurchaseDate)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Orders Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Customer Orders</h3>

          {/* Search and Filter Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Loader className="h-4 w-4" />
                    {statusFilter}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('All Statuses')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Paid')}>Paid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                  <TableHead className="w-[120px] font-semibold text-primary">
                    Order Number
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-primary">Amount</TableHead>
                  <TableHead className="w-[300px] font-semibold text-primary">Products</TableHead>
                  <TableHead className="w-[120px] font-semibold text-primary">Status</TableHead>
                  <TableHead className="w-[120px] font-semibold text-primary">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="min-h-[300px]">
                {/* Render actual orders */}
                {currentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="h-[60px] cursor-pointer hover:bg-muted/50"
                    onClick={() => onOrderSelect(order.id)}
                  >
                    <TableCell className="w-[120px] font-medium">{order.id}</TableCell>
                    <TableCell className="w-[120px] font-medium">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="w-[300px]">{formatProducts(order.products)}</TableCell>
                    <TableCell className="w-[120px]">
                      <Badge className={getStatusStyles(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="w-[120px] text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Render empty rows to maintain consistent height */}
                {Array.from(
                  { length: Math.max(0, itemsPerPage - currentOrders.length) },
                  (_, index) => (
                    <TableRow
                      key={`empty-${index}`}
                      className="h-[60px] border-0 hover:bg-transparent"
                    >
                      <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                      <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                      <TableCell className="w-[300px] border-0 p-4">&nbsp;</TableCell>
                      <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                      <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of{' '}
              {filteredOrders.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
