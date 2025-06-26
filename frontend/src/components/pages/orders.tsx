import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Calendar,
  ChevronDown,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  Search,
  Download,
  ShoppingCart,
  Loader,
} from 'lucide-react'
import { useState } from 'react'
import { AddOrder } from './add-order'
import { EditOrder } from './edit-order'
import { SingleOrder } from './single-order'

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    total: '$299.99',
    product: 'Wireless Headphones',
    status: 'Paid',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    total: '$149.50',
    product: 'Smart Watch',
    status: 'Pending',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    total: '$89.99',
    product: 'Phone Case',
    status: 'Paid',
    date: '2024-01-14',
  },
  {
    id: 'ORD-004',
    customer: 'Emily Brown',
    total: '$199.99',
    product: 'Bluetooth Speaker',
    status: 'Cancelled',
    date: '2024-01-14',
  },
  {
    id: 'ORD-005',
    customer: 'David Wilson',
    total: '$79.99',
    product: 'USB Cable',
    status: 'Pending',
    date: '2024-01-13',
  },
  {
    id: 'ORD-006',
    customer: 'Lisa Anderson',
    total: '$349.99',
    product: 'Tablet',
    status: 'Paid',
    date: '2024-01-13',
  },
  {
    id: 'ORD-007',
    customer: 'Tom Garcia',
    total: '$129.99',
    product: 'Keyboard',
    status: 'Paid',
    date: '2024-01-12',
  },
  {
    id: 'ORD-008',
    customer: 'Anna Martinez',
    total: '$59.99',
    product: 'Mouse Pad',
    status: 'Cancelled',
    date: '2024-01-12',
  },
  {
    id: 'ORD-009',
    customer: 'Robert Taylor',
    total: '$249.99',
    product: 'Gaming Mouse',
    status: 'Paid',
    date: '2024-01-11',
  },
  {
    id: 'ORD-010',
    customer: 'Jennifer White',
    total: '$179.99',
    product: 'Webcam',
    status: 'Pending',
    date: '2024-01-11',
  },
  {
    id: 'ORD-011',
    customer: 'Michael Brown',
    total: '$99.99',
    product: 'Desk Lamp',
    status: 'Paid',
    date: '2024-01-10',
  },
  {
    id: 'ORD-012',
    customer: 'Jessica Davis',
    total: '$399.99',
    product: 'Monitor',
    status: 'Cancelled',
    date: '2024-01-10',
  },
]

export function Orders() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [salesFilter, setSalesFilter] = useState('All Sales')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [editOrderId, setEditOrderId] = useState<string | null>(null)
  const itemsPerPage = 10
  const totalPages = Math.ceil(mockOrders.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = mockOrders.slice(startIndex, endIndex)

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

  const handleEditOrder = (orderId: string) => {
    setEditOrderId(orderId)
    setSelectedOrderId(null)
  }

  const handleDeleteOrder = (orderId: string) => {
    // Handle delete logic here - remove from orders list
    console.log('Delete order:', orderId)
    setSelectedOrderId(null)
    setEditOrderId(null)
  }

  if (showAddOrder) {
    return <AddOrder onBack={() => setShowAddOrder(false)} />
  }

  if (editOrderId) {
    return (
      <EditOrder
        orderId={editOrderId}
        onBack={() => setEditOrderId(null)}
        onDelete={handleDeleteOrder}
      />
    )
  }

  if (selectedOrderId) {
    return (
      <SingleOrder
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
        onEdit={handleEditOrder}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Orders Summary Section */}
      <div className="w-full rounded-lg bg-card p-6">
        {/* Title and Date Filter Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Orders</h3>
            <p className="text-sm text-muted-foreground">
              Manage and track all your orders in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl bg-muted hover:bg-muted/80 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Calendar className="h-4 w-4" />
                  Today
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Today</DropdownMenuItem>
                <DropdownMenuItem>Yesterday</DropdownMenuItem>
                <DropdownMenuItem>This Week</DropdownMenuItem>
                <DropdownMenuItem>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={() => setShowAddOrder(true)}
            >
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="border-t border-border">
          <div className="grid grid-cols-4">
            <div className="px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Completed Orders
                  </div>
                  <div className="text-2xl font-medium text-foreground">142</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <CheckCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Pending Orders
                  </div>
                  <div className="text-2xl font-medium text-foreground">23</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    WhatsApp Sales
                  </div>
                  <div className="text-2xl font-medium text-foreground">$18,420</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <MessageSquare className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Manual Sales</div>
                  <div className="text-2xl font-medium text-foreground">$6,160</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <FileText className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="w-full rounded-lg bg-card p-6">
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
                  <Calendar className="h-4 w-4" />
                  {dateFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDateFilter('All Dates')}>
                  All Dates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Today')}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Yesterday')}>
                  Yesterday
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('This Week')}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('This Month')}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Last Month')}>
                  Last Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {salesFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSalesFilter('All Sales')}>
                  All Sales
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSalesFilter('WhatsApp')}>
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSalesFilter('Manual')}>Manual</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <TableHead className="w-[100px] font-semibold text-primary">Order No.</TableHead>
                <TableHead className="w-[150px] font-semibold text-primary">Customer</TableHead>
                <TableHead className="w-[100px] font-semibold text-primary">Total</TableHead>
                <TableHead className="w-[180px] font-semibold text-primary">Product</TableHead>
                <TableHead className="w-[120px] font-semibold text-primary">Status</TableHead>
                <TableHead className="w-[100px] font-semibold text-primary">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[600px]">
              {/* Render actual orders */}
              {currentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="h-[60px] cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <TableCell className="w-[100px] font-medium">{order.id}</TableCell>
                  <TableCell className="w-[150px]">{order.customer}</TableCell>
                  <TableCell className="w-[100px] font-medium">{order.total}</TableCell>
                  <TableCell className="w-[180px]">{order.product}</TableCell>
                  <TableCell className="w-[120px]">
                    <Badge className={getStatusStyles(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="w-[100px] text-muted-foreground">{order.date}</TableCell>
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
                    <TableCell className="w-[100px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[150px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[100px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[180px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[100px] border-0 p-4">&nbsp;</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, mockOrders.length)} of{' '}
            {mockOrders.length} entries
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
  )
}
