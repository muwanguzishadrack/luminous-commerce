import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  CreditCard,
  Clock,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Smartphone,
  Filter,
  ReceiptText,
  Edit,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

// Mock data for transactions
const mockTransactions = [
  {
    id: 'TXN-001',
    type: 'income',
    method: 'online',
    amount: 299.99,
    description: 'Payment for Order #ORD-001',
    customer: 'John Smith',
    status: 'completed',
    date: '2024-01-15',
    time: '10:30 AM',
  },
  {
    id: 'TXN-002',
    type: 'expense',
    method: 'offline',
    amount: 150.0,
    description: 'Office Supplies Purchase - Expense #EXP-001',
    customer: 'Staples Inc.',
    status: 'completed',
    date: '2024-01-15',
    time: '09:15 AM',
    category: 'office-supplies',
  },
  {
    id: 'TXN-003',
    type: 'income',
    method: 'online',
    amount: 149.5,
    description: 'Payment for Order #ORD-002',
    customer: 'Sarah Johnson',
    status: 'pending',
    date: '2024-01-15',
    time: '08:45 AM',
  },
  {
    id: 'TXN-004',
    type: 'income',
    method: 'offline',
    amount: 89.99,
    description: 'Payment for Order #ORD-003',
    customer: 'Mike Davis',
    status: 'completed',
    date: '2024-01-14',
    time: '04:20 PM',
  },
  {
    id: 'TXN-005',
    type: 'expense',
    method: 'offline',
    amount: 75.0,
    description: 'Marketing Campaign - Expense #EXP-002',
    customer: 'Google LLC',
    status: 'completed',
    date: '2024-01-14',
    time: '02:30 PM',
    category: 'marketing',
  },
  {
    id: 'TXN-006',
    type: 'income',
    method: 'online',
    amount: 349.99,
    description: 'Payment for Order #ORD-006',
    customer: 'Lisa Anderson',
    status: 'pending',
    date: '2024-01-13',
    time: '11:15 AM',
  },
  {
    id: 'TXN-007',
    type: 'income',
    method: 'offline',
    amount: 129.99,
    description: 'Payment for Order #ORD-007',
    customer: 'Tom Garcia',
    status: 'completed',
    date: '2024-01-12',
    time: '03:45 PM',
  },
  {
    id: 'TXN-008',
    type: 'expense',
    method: 'offline',
    amount: 200.0,
    description: 'Inventory Restocking - Expense #EXP-003',
    customer: 'Wholesale Supplier',
    status: 'completed',
    date: '2024-01-12',
    time: '01:20 PM',
    category: 'inventory',
  },
]

export function Transactions() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [headerDateFilter, setHeaderDateFilter] = useState('Today')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [showCreateExpense, setShowCreateExpense] = useState(false)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isEditingTransaction, setIsEditingTransaction] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    vendor: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  })
  const itemsPerPage = 10
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = mockTransactions.slice(startIndex, endIndex)

  // Calculate summary metrics
  const totalOnlineTransactions = mockTransactions
    .filter((t) => t.method === 'online' && t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOfflineTransactions = mockTransactions
    .filter((t) => t.method === 'offline' && t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingSettlement = mockTransactions
    .filter((t) => t.status === 'pending' && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = mockTransactions
    .filter((t) => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'income' ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    )
  }

  const formatAmount = (amount: number, type: string) => {
    const formatted = `$${amount.toFixed(2)}`
    return type === 'income' ? `+${formatted}` : `-${formatted}`
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'office-supplies': 'Office Supplies',
      marketing: 'Marketing',
      inventory: 'Inventory',
      utilities: 'Utilities',
      travel: 'Travel',
      other: 'Other',
    }
    return categoryMap[category] || category
  }

  const handleCreateExpense = () => {
    setShowCreateExpense(true)
  }

  const handleCloseExpenseDialog = () => {
    setShowCreateExpense(false)
    // Reset form
    setExpenseForm({
      amount: '',
      description: '',
      vendor: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    })
  }

  const handleSaveExpense = () => {
    // Here you would typically save the expense to your backend
    // Since all expenses are offline, we set method to 'offline' when saving
    const expenseData = {
      ...expenseForm,
      method: 'offline', // All expenses are offline
      type: 'expense',
    }
    console.log('Saving expense:', expenseData)

    // For now, just close the dialog
    handleCloseExpenseDialog()

    // You could add the expense to the mockTransactions array here for immediate UI update
    // or refresh the data from your backend
  }

  const updateExpenseForm = (field: string, value: string) => {
    setExpenseForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsEditingTransaction(false)
    setShowTransactionDetails(true)
  }

  const handleCloseTransactionDetails = () => {
    setShowTransactionDetails(false)
    setSelectedTransaction(null)
    setIsEditingTransaction(false)
    // Reset expense form
    setExpenseForm({
      amount: '',
      description: '',
      vendor: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    })
  }

  const handleEditTransaction = () => {
    if (selectedTransaction && selectedTransaction.type === 'expense') {
      setExpenseForm({
        amount: selectedTransaction.amount.toString(),
        description: selectedTransaction.description,
        vendor: selectedTransaction.customer,
        category: selectedTransaction.category || '',
        date: selectedTransaction.date,
      })
      setIsEditingTransaction(true)
    }
  }

  const handleSaveEditedTransaction = () => {
    // Here you would typically update the transaction in your backend
    const updatedTransaction = {
      ...selectedTransaction,
      amount: parseFloat(expenseForm.amount),
      description: expenseForm.description,
      customer: expenseForm.vendor,
      category: expenseForm.category,
      date: expenseForm.date,
    }
    console.log('Updating transaction:', updatedTransaction)

    // For now, just close the dialog
    handleCloseTransactionDetails()
  }

  const handleDeleteTransaction = () => {
    // Here you would typically delete the transaction from your backend
    console.log('Deleting transaction:', selectedTransaction.id)

    // For now, just close the dialog
    handleCloseTransactionDetails()
  }

  return (
    <div className="space-y-6">
      {/* Transactions Header Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Title and Buttons Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Transactions</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and manage all your financial transactions in one place.
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
                  {headerDateFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setHeaderDateFilter('Today')}>
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeaderDateFilter('Yesterday')}>
                  Yesterday
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeaderDateFilter('This Week')}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeaderDateFilter('This Month')}>
                  This Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={handleCreateExpense}
            >
              <Plus className="h-4 w-4" />
              Add Expense
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
                    Total Online Sales
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    ${totalOnlineTransactions.toLocaleString()}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Smartphone className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Total Offline Sales
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    ${totalOfflineTransactions.toLocaleString()}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Building className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Pending Settlement
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    ${pendingSettlement.toLocaleString()}
                  </div>
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
                    Total Expenses
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    ${totalExpenses.toLocaleString()}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <ReceiptText className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Search Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex gap-3">
            {/* Date Filter */}
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

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Filter className="h-4 w-4" />
                  {typeFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTypeFilter('All Types')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Income')}>Income</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Expense')}>
                  Expense
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <CreditCard className="h-4 w-4" />
                  {statusFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('All Statuses')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Failed')}>
                  Failed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Button */}
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

        {/* Transactions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                <TableHead className="font-semibold text-primary">Type</TableHead>
                <TableHead className="font-semibold text-primary">Method</TableHead>
                <TableHead className="font-semibold text-primary">Description</TableHead>
                <TableHead className="font-semibold text-primary">Customer/Vendor</TableHead>
                <TableHead className="font-semibold text-primary">Amount</TableHead>
                <TableHead className="font-semibold text-primary">Status</TableHead>
                <TableHead className="font-semibold text-primary">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[600px]">
              {currentTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="h-[80px] cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="capitalize text-foreground">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-foreground">{transaction.method}</span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-foreground">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-foreground">{transaction.customer}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`capitalize ${getStatusStyles(transaction.status)}`}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="text-sm">{transaction.date}</div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Render empty rows to maintain consistent height */}
              {Array.from(
                { length: Math.max(0, itemsPerPage - currentTransactions.length) },
                (_, index) => (
                  <TableRow
                    key={`empty-${index}`}
                    className="h-[80px] border-0 hover:bg-transparent"
                  >
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="border-0 p-4">&nbsp;</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, mockTransactions.length)} of{' '}
            {mockTransactions.length} entries
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

      {/* Add Expense Dialog */}
      <Dialog open={showCreateExpense} onOpenChange={setShowCreateExpense}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Date and Amount Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => updateExpenseForm('date', e.target.value)}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) => updateExpenseForm('amount', e.target.value)}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Vendor */}
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Supplier *</Label>
              <Input
                id="vendor"
                placeholder="Enter vendor name"
                value={expenseForm.vendor}
                onChange={(e) => updateExpenseForm('vendor', e.target.value)}
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={expenseForm.category}
                onValueChange={(value) => updateExpenseForm('category', value)}
              >
                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office-supplies">Office Supplies</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description"
                value={expenseForm.description}
                onChange={(e) => updateExpenseForm('description', e.target.value)}
                className="min-h-[80px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseExpenseDialog}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveExpense}
              disabled={!expenseForm.amount || !expenseForm.vendor || !expenseForm.description}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTransaction?.type === 'income' ? (
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              )}
              {isEditingTransaction ? 'Edit Expense' : 'Transaction Details'}
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="grid gap-6 py-4">
              {isEditingTransaction ? (
                // Edit form for expenses
                <>
                  {/* Date and Amount Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Date *</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => updateExpenseForm('date', e.target.value)}
                        className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-amount">Amount *</Label>
                      <Input
                        id="edit-amount"
                        type="number"
                        placeholder="0.00"
                        value={expenseForm.amount}
                        onChange={(e) => updateExpenseForm('amount', e.target.value)}
                        className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>

                  {/* Vendor */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-vendor">Vendor/Supplier *</Label>
                    <Input
                      id="edit-vendor"
                      placeholder="Enter vendor name"
                      value={expenseForm.vendor}
                      onChange={(e) => updateExpenseForm('vendor', e.target.value)}
                      className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => updateExpenseForm('category', value)}
                    >
                      <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office-supplies">Office Supplies</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description *</Label>
                    <Textarea
                      id="edit-description"
                      placeholder="Enter expense description"
                      value={expenseForm.description}
                      onChange={(e) => updateExpenseForm('description', e.target.value)}
                      className="min-h-[80px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </>
              ) : (
                // View-only details
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {selectedTransaction.type === 'income' ? 'Order ID' : 'Expense ID'}
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedTransaction.type === 'income'
                          ? selectedTransaction.description.match(/#(ORD-\d+)/)?.[1] || 'N/A'
                          : selectedTransaction.description.match(/#(EXP-\d+)/)?.[1] || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(selectedTransaction.type)}
                        <span className="text-sm capitalize">{selectedTransaction.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                      <p className="text-sm">{selectedTransaction.date}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                      <p
                        className={`text-sm font-medium ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {formatAmount(selectedTransaction.amount, selectedTransaction.type)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      {selectedTransaction.type === 'income' ? 'Customer' : 'Vendor/Supplier'}
                    </Label>
                    <p className="text-sm">{selectedTransaction.customer}</p>
                  </div>

                  {selectedTransaction.category && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p className="text-sm">{getCategoryLabel(selectedTransaction.category)}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Method</Label>
                    <p className="text-sm capitalize">{selectedTransaction.method}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge
                      variant="secondary"
                      className={`capitalize ${getStatusStyles(selectedTransaction.status)}`}
                    >
                      {selectedTransaction.status}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm">{selectedTransaction.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {isEditingTransaction ? (
              // Edit mode buttons
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingTransaction(false)}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveEditedTransaction}
                  disabled={!expenseForm.amount || !expenseForm.vendor || !expenseForm.description}
                  className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  size="sm"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              // View mode buttons
              <>
                {selectedTransaction?.type === 'income' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseTransactionDetails}
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    size="sm"
                  >
                    Close
                  </Button>
                )}
                {selectedTransaction?.type === 'expense' && (
                  <>
                    <Button
                      type="button"
                      onClick={handleEditTransaction}
                      className="gap-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeleteTransaction}
                      className="gap-2 text-red-600 hover:text-red-700 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
