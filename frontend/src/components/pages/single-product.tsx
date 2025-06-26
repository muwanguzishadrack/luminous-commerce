import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit3,
  Search,
  Download,
  ChevronDown,
  Loader,
  ShoppingCart,
  CreditCard,
  Package,
  Calendar,
} from 'lucide-react'
import { useState } from 'react'

// Mock data for product orders (orders specific to this product)
const mockProductOrders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    quantity: 1,
    total: 299.99,
    status: 'Paid',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    quantity: 2,
    total: 598.98,
    status: 'Paid',
    date: '2024-01-14',
  },
  {
    id: 'ORD-009',
    customer: 'Robert Taylor',
    quantity: 1,
    total: 299.99,
    status: 'Paid',
    date: '2024-01-11',
  },
  {
    id: 'ORD-015',
    customer: 'Sarah Wilson',
    quantity: 1,
    total: 299.99,
    status: 'Pending',
    date: '2024-01-10',
  },
  {
    id: 'ORD-021',
    customer: 'Tom Garcia',
    quantity: 3,
    total: 899.97,
    status: 'Paid',
    date: '2024-01-09',
  },
  {
    id: 'ORD-027',
    customer: 'Lisa Anderson',
    quantity: 1,
    total: 299.99,
    status: 'Cancelled',
    date: '2024-01-08',
  },
  {
    id: 'ORD-033',
    customer: 'David Brown',
    quantity: 2,
    total: 598.98,
    status: 'Paid',
    date: '2024-01-07',
  },
  {
    id: 'ORD-039',
    customer: 'Emma Davis',
    quantity: 1,
    total: 299.99,
    status: 'Pending',
    date: '2024-01-06',
  },
]

// Mock product data
const mockProduct = {
  id: 'PRD-001',
  name: 'Wireless Headphones',
  image:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center',
  category: 'Electronics',
  stock: 25,
  price: 299.99,
  dateAdded: '2024-01-01',
  description:
    'High-quality wireless headphones with noise cancellation and premium sound quality.',
}

interface SingleProductProps {
  productId: string
  onBack: () => void
  onEdit: (productId: string) => void
  onOrderSelect: (orderId: string) => void
}

export function SingleProduct({ productId, onBack, onEdit, onOrderSelect }: SingleProductProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const itemsPerPage = 5

  // Filter orders based on search and status
  const filteredOrders = mockProductOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All Statuses' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  // Calculate summary metrics
  const totalOrders = mockProductOrders.filter((order) => order.status === 'Paid').length
  const totalRevenue = mockProductOrders
    .filter((order) => order.status === 'Paid')
    .reduce((sum, order) => sum + order.total, 0)
  const totalQuantitySold = mockProductOrders
    .filter((order) => order.status === 'Paid')
    .reduce((sum, order) => sum + order.quantity, 0)

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

  const handleExport = () => {
    // Handle export logic here
    console.log('Exporting product orders...')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 rounded-xl p-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
          <h2 className="text-xl font-medium tracking-tight text-gray-900">{mockProduct.name}</h2>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            onClick={() => onEdit(productId)}
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Edit3 className="h-4 w-4" />
            Edit Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Product Summary Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Product Summary</h3>

          <div className="flex items-start gap-6">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm text-muted-foreground">Date Added</div>
                <div className="text-sm font-medium">{mockProduct.dateAdded}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                <ShoppingCart className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm text-muted-foreground">Total Paid Orders</div>
                <div className="text-sm font-medium">{totalOrders}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                <CreditCard className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-sm font-medium">${totalRevenue.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                <Package className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm text-muted-foreground">Quantity Sold</div>
                <div className="text-sm font-medium">{totalQuantitySold}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-lg bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Recent Orders</h3>

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

            {/* Filter and Export Controls */}
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                  <TableHead className="w-[120px] font-semibold text-primary">Order No.</TableHead>
                  <TableHead className="w-[180px] font-semibold text-primary">Customer</TableHead>
                  <TableHead className="w-[100px] font-semibold text-primary">Quantity</TableHead>
                  <TableHead className="w-[120px] font-semibold text-primary">Total</TableHead>
                  <TableHead className="w-[120px] font-semibold text-primary">Status</TableHead>
                  <TableHead className="w-[120px] font-semibold text-primary">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="min-h-[600px]">
                {/* Render actual orders */}
                {currentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="h-[60px] cursor-pointer hover:bg-muted/50"
                    onClick={() => onOrderSelect(order.id)}
                  >
                    <TableCell className="w-[120px] font-medium">{order.id}</TableCell>
                    <TableCell className="w-[180px]">{order.customer}</TableCell>
                    <TableCell className="w-[100px] font-medium">{order.quantity}</TableCell>
                    <TableCell className="w-[120px] font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      <Badge className={getStatusStyles(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="w-[120px] text-muted-foreground">{order.date}</TableCell>
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
                      <TableCell className="w-[180px] border-0 p-4">&nbsp;</TableCell>
                      <TableCell className="w-[100px] border-0 p-4">&nbsp;</TableCell>
                      <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
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
