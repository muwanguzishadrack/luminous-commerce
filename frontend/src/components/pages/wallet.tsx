import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { ArrowUpRight, Search, Download, Eye, EyeOff, Wallet as WalletIcon } from 'lucide-react'
import { useState } from 'react'

// Mock data for wallet transactions (online payments only - credits only)
const mockWalletTransactions = [
  {
    id: 'WLT-001',
    type: 'credit',
    amount: 299.99,
    description: 'Payment received for Order #ORD-001',
    status: 'completed',
    date: '2024-01-20',
    time: '10:30 AM',
  },
  {
    id: 'WLT-003',
    type: 'credit',
    amount: 149.5,
    description: 'Payment received for Order #ORD-002',
    status: 'completed',
    date: '2024-01-19',
    time: '08:45 AM',
  },
  {
    id: 'WLT-004',
    type: 'credit',
    amount: 349.99,
    description: 'Payment received for Order #ORD-006',
    status: 'pending',
    date: '2024-01-18',
    time: '11:15 AM',
  },
  {
    id: 'WLT-006',
    type: 'credit',
    amount: 89.99,
    description: 'Payment received for Order #ORD-003',
    status: 'completed',
    date: '2024-01-16',
    time: '04:20 PM',
  },
  {
    id: 'WLT-007',
    type: 'credit',
    amount: 199.99,
    description: 'Payment received for Order #ORD-004',
    status: 'completed',
    date: '2024-01-15',
    time: '09:10 AM',
  },
  {
    id: 'WLT-009',
    type: 'credit',
    amount: 459.99,
    description: 'Payment received for Order #ORD-005',
    status: 'completed',
    date: '2024-01-14',
    time: '02:15 PM',
  },
  {
    id: 'WLT-010',
    type: 'credit',
    amount: 129.99,
    description: 'Payment received for Order #ORD-008',
    status: 'completed',
    date: '2024-01-13',
    time: '11:30 AM',
  },
  {
    id: 'WLT-011',
    type: 'credit',
    amount: 249.99,
    description: 'Payment received for Order #ORD-009',
    status: 'pending',
    date: '2024-01-12',
    time: '03:45 PM',
  },
]

export function Wallet() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showBalance, setShowBalance] = useState(true)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const itemsPerPage = 5

  // Calculate available balance (only credits since no debits)
  const availableBalance = mockWalletTransactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  // Filter transactions based on search
  const filteredTransactions = mockWalletTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

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

  const getTypeIcon = () => {
    return <ArrowUpRight className="h-4 w-4 text-green-600" />
  }

  const formatAmount = (amount: number) => {
    const formatted = `$${amount.toFixed(2)}`
    return `+${formatted}`
  }

  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`
  }

  const handleWithdraw = () => {
    console.log('Opening withdrawal dialog...')
    // Here you would open a withdrawal dialog
  }

  const handleExport = () => {
    console.log('Exporting wallet transactions...')
    // Here you would handle export logic
  }

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetails(true)
  }

  const handleCloseTransactionDetails = () => {
    setShowTransactionDetails(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Title and Withdraw Button Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Track and manage your online payment transactions and withdrawals.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={handleWithdraw}
            >
              <WalletIcon className="h-4 w-4" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Available Balance Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between rounded-lg bg-secondary/20 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">
                  Available Balance
                </div>
                <div className="text-2xl font-semibold text-foreground">
                  {showBalance ? `$${availableBalance.toLocaleString()}` : '••••••'}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="h-8 w-8 rounded-full p-0 hover:bg-secondary/30"
            >
              {showBalance ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Transactions Table Section */}
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

        {/* Transactions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                <TableHead className="w-[120px] font-semibold text-primary">Type</TableHead>
                <TableHead className="w-[300px] font-semibold text-primary">Description</TableHead>
                <TableHead className="w-[120px] font-semibold text-primary">Amount</TableHead>
                <TableHead className="w-[120px] font-semibold text-primary">Status</TableHead>
                <TableHead className="w-[180px] font-semibold text-primary">Date & Time</TableHead>
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
                      {getTypeIcon()}
                      <span className="capitalize text-foreground">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[300px] max-w-xs truncate text-foreground">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <span
                      className={`font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatAmount(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <Badge
                      variant="secondary"
                      className={`capitalize ${getStatusStyles(transaction.status)}`}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[180px] text-muted-foreground">
                    <div className="text-sm">
                      {formatDateTime(transaction.date, transaction.time)}
                    </div>
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
                    <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[300px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[180px] border-0 p-4">&nbsp;</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} entries
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

      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </Label>
                    <p className="text-sm font-medium">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-sm capitalize">Credit</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                    <p className="text-sm">{selectedTransaction.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                    <p className="text-sm">{selectedTransaction.time}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p className="text-sm font-medium text-green-600">
                      {formatAmount(selectedTransaction.amount)}
                    </p>
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
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedTransaction.description}</p>
                </div>

                {selectedTransaction.description.includes('Order #') && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Order ID</Label>
                    <p className="text-sm font-medium">
                      {selectedTransaction.description.match(/#(ORD-\d+)/)?.[1] || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseTransactionDetails}
              className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              size="sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
