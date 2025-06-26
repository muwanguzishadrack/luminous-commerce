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
  Plus,
  Search,
  Upload,
  Package,
  AlertTriangle,
  Grid3X3,
  ChevronDown,
  Filter,
  X,
  Layers2,
} from 'lucide-react'
import { useState } from 'react'
import { AddProduct } from './add-product'
import { SingleProduct } from './single-product'
import { SingleOrder } from './single-order'
import { EditProduct } from './edit-product'

// Mock data for products
const mockProducts = [
  {
    id: 'PRD-001',
    name: 'Wireless Headphones',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 25,
    price: 299.99,
  },
  {
    id: 'PRD-002',
    name: 'Smart Watch',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 15,
    price: 149.5,
  },
  {
    id: 'PRD-003',
    name: 'Bluetooth Speaker',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 8,
    price: 199.99,
  },
  {
    id: 'PRD-004',
    name: 'Phone Case',
    image:
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop&crop=center',
    category: 'Accessories',
    stock: 45,
    price: 89.99,
  },
  {
    id: 'PRD-005',
    name: 'USB Cable',
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop&crop=center',
    category: 'Accessories',
    stock: 32,
    price: 79.99,
  },
  {
    id: 'PRD-006',
    name: 'Gaming Mouse',
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 12,
    price: 249.99,
  },
  {
    id: 'PRD-007',
    name: 'Desk Lamp',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
    category: 'Home & Office',
    stock: 18,
    price: 99.99,
  },
  {
    id: 'PRD-008',
    name: 'Webcam',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 6,
    price: 179.99,
  },
  {
    id: 'PRD-009',
    name: 'Keyboard',
    image:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 22,
    price: 129.99,
  },
  {
    id: 'PRD-010',
    name: 'Monitor',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop&crop=center',
    category: 'Electronics',
    stock: 3,
    price: 399.99,
  },
]

export function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [stockFilter, setStockFilter] = useState('All Stock')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [editProductId, setEditProductId] = useState<string | null>(null)
  const itemsPerPage = 10

  // Get unique categories
  const categories = ['All Categories', ...Array.from(new Set(mockProducts.map((p) => p.category)))]
  const stockOptions = ['All Stock', 'In Stock', 'Medium Stock', 'Low Stock']

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === 'All Categories' || product.category === categoryFilter

    const matchesStock =
      stockFilter === 'All Stock' ||
      (stockFilter === 'Low Stock' && product.stock <= 5) ||
      (stockFilter === 'Medium Stock' && product.stock > 5 && product.stock <= 15) ||
      (stockFilter === 'In Stock' && product.stock > 15)

    return matchesSearch && matchesCategory && matchesStock
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: 'category' | 'stock', value: string) => {
    setCurrentPage(1)
    if (filterType === 'category') {
      setCategoryFilter(value)
    } else {
      setStockFilter(value)
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('')
    setCategoryFilter('All Categories')
    setStockFilter('All Stock')
    setCurrentPage(1)
  }

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery !== '' || categoryFilter !== 'All Categories' || stockFilter !== 'All Stock'

  const getStockBadge = (stock: number) => {
    if (stock <= 5) {
      return 'bg-red-100 text-red-800 hover:bg-red-100/80'
    } else if (stock <= 15) {
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
    } else {
      return 'bg-green-100 text-green-800 hover:bg-green-100/80'
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock <= 5) {
      return 'Low Stock'
    } else if (stock <= 15) {
      return 'Medium Stock'
    } else {
      return 'In Stock'
    }
  }

  if (showAddProduct) {
    return <AddProduct onBack={() => setShowAddProduct(false)} />
  }

  if (editProductId) {
    return <EditProduct productId={editProductId} onBack={() => setEditProductId(null)} />
  }

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

  if (selectedProductId) {
    return (
      <SingleProduct
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
        onEdit={(productId) => setEditProductId(productId)}
        onOrderSelect={(orderId) => setSelectedOrderId(orderId)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Products Header Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Title and Buttons Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Products</h3>
            <p className="text-sm text-muted-foreground">
              Manage your product inventory and pricing.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Upload className="h-4 w-4" />
              Import Products
            </Button>
            <Button
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={() => setShowAddProduct(true)}
            >
              <Plus className="h-4 w-4" />
              Add New Product
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
                    Total Products
                  </div>
                  <div className="text-2xl font-medium text-foreground">{mockProducts.length}</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Package className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Low Stock Items
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    {mockProducts.filter((p) => p.stock <= 5).length}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <AlertTriangle className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Categories</div>
                  <div className="text-2xl font-medium text-foreground">
                    {new Set(mockProducts.map((p) => p.category)).size}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Grid3X3 className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-medium text-foreground">
                    ${mockProducts.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Layers2 className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="w-full rounded-lg bg-card p-6 shadow-sm">
        {/* Search Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex gap-3">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Filter className="h-4 w-4" />
                  {categoryFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stock Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Package className="h-4 w-4" />
                  {stockFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {stockOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleFilterChange('stock', option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="gap-2 rounded-xl text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                <TableHead className="w-[250px] font-semibold text-primary">Product</TableHead>
                <TableHead className="w-[120px] font-semibold text-primary">Category</TableHead>
                <TableHead className="w-[140px] font-semibold text-primary">Stock</TableHead>
                <TableHead className="w-[100px] font-semibold text-primary">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[600px]">
              {/* Render actual products */}
              {currentProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="h-[80px] cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <TableCell className="w-[250px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px]">{product.category}</TableCell>
                  <TableCell className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.stock}</span>
                      <Badge className={getStockBadge(product.stock)} variant="secondary">
                        {getStockStatus(product.stock)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="w-[100px] font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Render empty rows to maintain consistent height */}
              {Array.from(
                { length: Math.max(0, itemsPerPage - currentProducts.length) },
                (_, index) => (
                  <TableRow
                    key={`empty-${index}`}
                    className="h-[80px] border-0 hover:bg-transparent"
                  >
                    <TableCell className="w-[250px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                    <TableCell className="w-[140px] border-0 p-4">&nbsp;</TableCell>
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{' '}
            {filteredProducts.length} entries
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
