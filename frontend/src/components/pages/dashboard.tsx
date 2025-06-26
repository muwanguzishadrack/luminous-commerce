import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  CreditCard,
  Megaphone,
  Calendar,
  ChevronDown,
  ReceiptText,
  ShoppingCart,
  UsersRound,
  MessageSquareMore,
  ArrowUpRight,
} from 'lucide-react'
import { useState } from 'react'

// Mock data for recent orders
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
]

// Mock data for sales chart
const salesData = [
  { day: 'Mon', online: 12000, offline: 7000 },
  { day: 'Tue', online: 7000, offline: 11000 },
  { day: 'Wed', online: 49000, offline: 19500 },
  { day: 'Thu', online: 19500, offline: 24000 },
  { day: 'Fri', online: 24000, offline: 19000 },
  { day: 'Sat', online: 19000, offline: 21500 },
  { day: 'Sun', online: 21500, offline: 12000 },
]

// Mock data for top selling products
const topProducts = [
  {
    id: 'PRD-001',
    name: 'Wireless Headphones',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
    quantitySold: 156,
  },
  {
    id: 'PRD-002',
    name: 'Smart Watch',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center',
    quantitySold: 142,
  },
  {
    id: 'PRD-003',
    name: 'Bluetooth Speaker',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop&crop=center',
    quantitySold: 98,
  },
  {
    id: 'PRD-004',
    name: 'Phone Case',
    image:
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop&crop=center',
    quantitySold: 87,
  },
  {
    id: 'PRD-005',
    name: 'USB Cable',
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop&crop=center',
    quantitySold: 73,
  },
  {
    id: 'PRD-006',
    name: 'Laptop Stand',
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop&crop=center',
    quantitySold: 65,
  },
]

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [salesFilter, setSalesFilter] = useState('This Week')
  const itemsPerPage = 5
  const totalPages = Math.ceil(mockOrders.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = mockOrders.slice(startIndex, endIndex)

  // Find max value for chart scaling
  const maxValue = Math.max(...salesData.flatMap((d) => [d.online, d.offline]))

  // Format amount for display
  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`
    }
    return `$${amount}`
  }

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="pb-1 text-3xl font-medium tracking-tight text-gray-900">
            Good morning, John!
          </h2>
          <p className="text-sm text-gray-600">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <CreditCard className="h-4 w-4" />
            Add Transaction
          </Button>
          <Button
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Megaphone className="h-4 w-4" />
            Run Campaign
          </Button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Title and Date Filter Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Summary</h3>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
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
        </div>

        {/* Metrics Row */}
        <div className="border-t border-border">
          <div className="grid grid-cols-4">
            <div className="px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Sales</div>
                  <div className="text-2xl font-medium text-foreground">$24,580</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <ReceiptText className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Orders</div>
                  <div className="text-2xl font-medium text-foreground">156</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <ShoppingCart className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Customers</div>
                  <div className="text-2xl font-medium text-foreground">1,247</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <UsersRound className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Chats</div>
                  <div className="text-2xl font-medium text-foreground">89</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <MessageSquareMore className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Overview and Quick Actions Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Sales Overview Section - Takes 2/3 of the space */}
        <div className="col-span-2 w-full rounded-lg bg-card p-6 shadow-sm">
          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Sales Overview</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl bg-muted hover:bg-muted/80 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Calendar className="h-4 w-4" />
                  {salesFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSalesFilter('This Week')}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSalesFilter('Last Week')}>
                  Last Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSalesFilter('This Month')}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSalesFilter('Custom')}>Custom</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Chart Container */}
          <div className="space-y-4">
            {/* Chart */}
            <div className="relative rounded-lg">
              {/* Y-axis labels */}
              <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-between py-6 pr-4 text-xs text-muted-foreground">
                <span>{formatAmount(maxValue)}</span>
                <span>{formatAmount(maxValue * 0.75)}</span>
                <span>{formatAmount(maxValue * 0.5)}</span>
                <span>{formatAmount(maxValue * 0.25)}</span>
                <span>$0</span>
              </div>

              {/* Horizontal grid lines */}
              <div className="relative ml-12" style={{ height: '250px' }}>
                <div className="absolute inset-0 flex flex-col justify-between py-0">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="h-px w-full bg-border/30"></div>
                  ))}
                </div>

                {/* Chart bars */}
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {salesData.map((data, index) => (
                    <div
                      key={index}
                      className="group relative flex flex-col items-center"
                      style={{ width: '40px' }}
                    >
                      <div className="flex w-full justify-center gap-1.5">
                        {/* Online sales bar */}
                        <div className="relative w-4" style={{ height: '250px' }}>
                          <div
                            className="absolute bottom-0 w-full rounded-t bg-primary transition-all duration-300 hover:bg-primary/80"
                            style={{
                              height: `${(data.online / maxValue) * 100}%`,
                              minHeight: '4px',
                            }}
                          ></div>
                        </div>
                        {/* Offline sales bar */}
                        <div className="relative w-4" style={{ height: '250px' }}>
                          <div
                            className="absolute bottom-0 w-full rounded-t bg-primary/60 transition-all duration-300 hover:bg-primary/70"
                            style={{
                              height: `${(data.offline / maxValue) * 100}%`,
                              minHeight: '4px',
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Enhanced Tooltip */}
                      <div className="pointer-events-none absolute -top-20 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-lg border bg-card px-3 py-2 text-xs text-card-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{data.day}</div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span className="text-muted-foreground">Online:</span>
                            <span className="font-medium">{formatAmount(data.online)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                            <span className="text-muted-foreground">Offline:</span>
                            <span className="font-medium">{formatAmount(data.offline)}</span>
                          </div>
                          <div className="border-t border-border pt-1">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="ml-1 font-semibold">
                              {formatAmount(data.online + data.offline)}
                            </span>
                          </div>
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-card"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="ml-12 flex justify-between px-4 pt-4">
                {salesData.map((data, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground"
                    style={{ width: '40px', textAlign: 'center' }}
                  >
                    {data.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Legend - Moved below chart */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary"></div>
                <span className="text-sm text-muted-foreground">Online Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary/60"></div>
                <span className="text-sm text-muted-foreground">Offline Sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products Section - Takes 1/3 of the space */}
        <div className="col-span-1 w-full rounded-lg bg-card p-6 shadow-sm">
          {/* Section Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground">Top Selling Products</h3>
          </div>

          {/* Products Compact Table */}
          <div className="space-y-1">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-normal text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.id}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{product.quantitySold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Recent Orders</h3>
          <Button variant="ghost" className="gap-2 rounded-xl text-primary hover:text-primary/80">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
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
            <TableBody className="min-h-[300px]">
              {/* Render actual orders */}
              {currentOrders.map((order) => (
                <TableRow key={order.id} className="h-[60px]">
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
