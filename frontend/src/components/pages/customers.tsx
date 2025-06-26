import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Plus, Search, Download, Upload, Users, UserCheck, UserPlus, UserX } from 'lucide-react'
import { useState } from 'react'
import { SingleCustomer } from './single-customer'
import { SingleOrder } from './single-order'

// Mock data for customers
const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateAdded: '2024-01-15',
    lastOrderDate: '2024-01-20',
    totalOrders: 5,
    totalSpent: 1299.95,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-002',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 234-5678',
    dateAdded: '2024-01-14',
    lastOrderDate: '2024-01-19',
    totalOrders: 3,
    totalSpent: 879.97,
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b412?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-003',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1 (555) 345-6789',
    dateAdded: '2024-01-12',
    lastOrderDate: '2024-01-18',
    totalOrders: 8,
    totalSpent: 2199.92,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-004',
    name: 'Emily Johnson',
    email: 'emily.johnson@email.com',
    phone: '+1 (555) 456-7890',
    dateAdded: '2024-01-10',
    lastOrderDate: '2024-01-17',
    totalOrders: 2,
    totalSpent: 549.98,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-005',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1 (555) 567-8901',
    dateAdded: '2024-01-08',
    lastOrderDate: '2024-01-16',
    totalOrders: 12,
    totalSpent: 3299.88,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1 (555) 678-9012',
    dateAdded: '2024-01-06',
    lastOrderDate: '2024-01-15',
    totalOrders: 6,
    totalSpent: 1499.94,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-007',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1 (555) 789-0123',
    dateAdded: '2024-01-04',
    lastOrderDate: '2024-01-14',
    totalOrders: 4,
    totalSpent: 1099.96,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-008',
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    phone: '+1 (555) 890-1234',
    dateAdded: '2024-01-02',
    lastOrderDate: '2024-01-13',
    totalOrders: 7,
    totalSpent: 1899.93,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-009',
    name: 'Tom Garcia',
    email: 'tom.garcia@email.com',
    phone: '+1 (555) 901-2345',
    dateAdded: '2023-12-28',
    lastOrderDate: '2024-01-12',
    totalOrders: 9,
    totalSpent: 2399.91,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center',
  },
  {
    id: 'CUST-010',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '+1 (555) 012-3456',
    dateAdded: '2023-12-25',
    lastOrderDate: '2024-01-11',
    totalOrders: 1,
    totalSpent: 299.99,
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=center',
  },
]

export function Customers() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showCreateCustomer, setShowCreateCustomer] = useState(false)
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
  })
  const itemsPerPage = 10

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  // Calculate statistics
  const totalCustomers = mockCustomers.length
  const newCustomersThisMonth = mockCustomers.filter((customer) => {
    const customerDate = new Date(customer.dateAdded)
    const now = new Date()
    return (
      customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear()
    )
  }).length
  const activeCustomers = mockCustomers.filter((customer) => {
    const lastOrder = new Date(customer.lastOrderDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastOrder >= thirtyDaysAgo
  }).length
  const dormantCustomers = mockCustomers.filter((customer) => {
    const lastOrder = new Date(customer.lastOrderDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastOrder < thirtyDaysAgo
  }).length

  const handleExport = () => {
    // Handle export logic here
    console.log('Exporting customers...')
  }

  const handleCreateCustomer = () => {
    setShowCreateCustomer(true)
  }

  const handleCloseCustomerDialog = () => {
    setShowCreateCustomer(false)
    // Reset form
    setCustomerForm({
      name: '',
      phone: '',
    })
  }

  const handleEditCustomer = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId)
    if (customer) {
      setEditingCustomerId(customerId)
      setCustomerForm({
        name: customer.name,
        phone: customer.phone,
      })
      setShowEditCustomer(true)
    }
  }

  const handleCloseEditDialog = () => {
    setShowEditCustomer(false)
    setEditingCustomerId(null)
    // Reset form
    setCustomerForm({
      name: '',
      phone: '',
    })
  }

  const handleSaveCustomer = () => {
    // Here you would typically save the customer to your backend
    const customerData = {
      ...customerForm,
      id: `CUST-${String(mockCustomers.length + 1).padStart(3, '0')}`,
      email: '', // Could be added later or made optional
      dateAdded: new Date().toISOString().split('T')[0],
      lastOrderDate: '',
      totalOrders: 0,
      totalSpent: 0,
    }
    console.log('Saving customer:', customerData)

    // For now, just close the dialog
    handleCloseCustomerDialog()

    // You could add the customer to the mockCustomers array here for immediate UI update
    // or refresh the data from your backend
  }

  const handleUpdateCustomer = () => {
    // Here you would typically update the customer in your backend
    const updatedCustomerData = {
      id: editingCustomerId,
      name: customerForm.name,
      phone: customerForm.phone,
    }
    console.log('Updating customer:', updatedCustomerData)

    // For now, just close the dialog
    handleCloseEditDialog()

    // You could update the customer in the mockCustomers array here for immediate UI update
    // or refresh the data from your backend
  }

  const updateCustomerForm = (field: string, value: string) => {
    setCustomerForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Show single order page if an order is selected
  if (selectedOrderId) {
    return (
      <SingleOrder
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
        onEdit={(orderId) => {
          console.log('Edit order:', orderId)
          setSelectedOrderId(null)
        }}
      />
    )
  }

  // Show single customer page if a customer is selected
  if (selectedCustomerId) {
    return (
      <SingleCustomer
        customerId={selectedCustomerId}
        onBack={() => setSelectedCustomerId(null)}
        onUpdateDetails={(customerId) => {
          console.log('Update customer details:', customerId)
          // Open edit dialog instead of just logging
          setSelectedCustomerId(null)
          handleEditCustomer(customerId)
        }}
        onOrderSelect={(orderId) => {
          setSelectedOrderId(orderId)
          setSelectedCustomerId(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Customers Header Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Title and Buttons Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Customers</h3>
            <p className="text-sm text-muted-foreground">
              Manage your customer relationships and track their activity.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Upload className="h-4 w-4" />
              Import Contacts
            </Button>
            <Button
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={handleCreateCustomer}
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="border-t border-border">
          <div className="grid grid-cols-4">
            <div className="px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Total Customers
                  </div>
                  <div className="text-2xl font-medium text-foreground">{totalCustomers}</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    New This Month
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    {newCustomersThisMonth}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <UserCheck className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Active Customers
                  </div>
                  <div className="text-2xl font-medium text-foreground">{activeCustomers}</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <UserPlus className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Dormant Customers
                  </div>
                  <div className="text-2xl font-medium text-foreground">{dormantCustomers}</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <UserX className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Search Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Export Button */}
          <div className="flex gap-3">
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

        {/* Customers Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                <TableHead className="w-[280px] font-semibold text-primary">Name</TableHead>
                <TableHead className="w-[150px] font-semibold text-primary">Phone Number</TableHead>
                <TableHead className="w-[120px] font-semibold text-primary">Date Added</TableHead>
                <TableHead className="w-[140px] font-semibold text-primary">
                  Last Order Date
                </TableHead>
                <TableHead className="w-[120px] font-semibold text-primary">Total Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[600px]">
              {/* Render actual customers */}
              {currentCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="h-[80px] cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <TableCell className="w-[280px]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30">
                        <span className="text-sm font-medium text-secondary-foreground">
                          {customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[150px] font-medium">{customer.phone}</TableCell>
                  <TableCell className="w-[120px] text-muted-foreground">
                    {formatDate(customer.dateAdded)}
                  </TableCell>
                  <TableCell className="w-[140px] text-muted-foreground">
                    {formatDate(customer.lastOrderDate)}
                  </TableCell>
                  <TableCell className="w-[120px] font-medium">{customer.totalOrders}</TableCell>
                </TableRow>
              ))}
              {/* Render empty rows to maintain consistent height */}
              {Array.from(
                { length: Math.max(0, itemsPerPage - currentCustomers.length) },
                (_, index) => (
                  <TableRow
                    key={`empty-${index}`}
                    className="h-[80px] border-0 hover:bg-transparent"
                  >
                    <TableCell className="w-[280px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[150px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[140px] border-0 p-4">&nbsp;</TableCell>
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} entries
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

      {/* Add Customer Dialog */}
      <Dialog open={showCreateCustomer} onOpenChange={setShowCreateCustomer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name *</Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={customerForm.name}
                onChange={(e) => updateCustomerForm('name', e.target.value)}
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone Number *</Label>
              <Input
                id="customer-phone"
                placeholder="Enter phone number"
                value={customerForm.phone}
                onChange={(e) => updateCustomerForm('phone', e.target.value)}
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseCustomerDialog}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveCustomer}
              disabled={!customerForm.name || !customerForm.phone}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditCustomer} onOpenChange={setShowEditCustomer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-customer-name">Customer Name *</Label>
              <Input
                id="edit-customer-name"
                placeholder="Enter customer name"
                value={customerForm.name}
                onChange={(e) => updateCustomerForm('name', e.target.value)}
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="edit-customer-phone">Phone Number *</Label>
              <Input
                id="edit-customer-phone"
                placeholder="Enter phone number"
                value={customerForm.phone}
                onChange={(e) => updateCustomerForm('phone', e.target.value)}
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseEditDialog}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateCustomer}
              disabled={!customerForm.name || !customerForm.phone}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
