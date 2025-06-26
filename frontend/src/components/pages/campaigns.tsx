import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Send,
  FileText,
  MessageSquare,
  CheckCircle,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { useState } from 'react'

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 'CAM-001',
    name: 'Summer Sale 2024',
    template: 'Promotional Offer',
    deliveryRate: '98.5%',
    readRate: '76.2%',
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: 'CAM-002',
    name: 'New Product Launch',
    template: 'Product Announcement',
    deliveryRate: '97.8%',
    readRate: '82.1%',
    status: 'Completed',
    createdAt: '2024-01-14',
  },
  {
    id: 'CAM-003',
    name: 'Customer Feedback Survey',
    template: 'Survey Request',
    deliveryRate: '99.2%',
    readRate: '45.3%',
    status: 'Active',
    createdAt: '2024-01-13',
  },
  {
    id: 'CAM-004',
    name: 'Holiday Greetings',
    template: 'Seasonal Message',
    deliveryRate: '96.7%',
    readRate: '89.4%',
    status: 'Completed',
    createdAt: '2024-01-12',
  },
  {
    id: 'CAM-005',
    name: 'Flash Sale Alert',
    template: 'Urgent Promotion',
    deliveryRate: '98.9%',
    readRate: '91.2%',
    status: 'Scheduled',
    createdAt: '2024-01-11',
  },
  {
    id: 'CAM-006',
    name: 'Welcome Series',
    template: 'Onboarding Flow',
    deliveryRate: '99.5%',
    readRate: '67.8%',
    status: 'Active',
    createdAt: '2024-01-10',
  },
  {
    id: 'CAM-007',
    name: 'Abandoned Cart Recovery',
    template: 'Cart Reminder',
    deliveryRate: '97.3%',
    readRate: '58.9%',
    status: 'Active',
    createdAt: '2024-01-09',
  },
  {
    id: 'CAM-008',
    name: 'VIP Customer Exclusive',
    template: 'Exclusive Offer',
    deliveryRate: '100%',
    readRate: '94.7%',
    status: 'Completed',
    createdAt: '2024-01-08',
  },
]

// Mock data for templates
const mockTemplates = [
  {
    id: 'TEMP-001',
    name: 'Welcome Message',
    category: 'Onboarding',
    status: 'Active',
    type: 'Text',
    health: 'Healthy',
    createdAt: '2024-01-20',
  },
  {
    id: 'TEMP-002',
    name: 'Order Confirmation',
    category: 'Transactional',
    status: 'Active',
    type: 'Rich Media',
    health: 'Healthy',
    createdAt: '2024-01-19',
  },
  {
    id: 'TEMP-003',
    name: 'Promotional Offer',
    category: 'Marketing',
    status: 'Active',
    type: 'Interactive',
    health: 'Warning',
    createdAt: '2024-01-18',
  },
  {
    id: 'TEMP-004',
    name: 'Cart Abandonment',
    category: 'Automation',
    status: 'Draft',
    type: 'Text',
    health: 'Healthy',
    createdAt: '2024-01-17',
  },
  {
    id: 'TEMP-005',
    name: 'Survey Request',
    category: 'Feedback',
    status: 'Active',
    type: 'Interactive',
    health: 'Critical',
    createdAt: '2024-01-16',
  },
  {
    id: 'TEMP-006',
    name: 'Holiday Greetings',
    category: 'Seasonal',
    status: 'Inactive',
    type: 'Rich Media',
    health: 'Healthy',
    createdAt: '2024-01-15',
  },
  {
    id: 'TEMP-007',
    name: 'Product Launch',
    category: 'Marketing',
    status: 'Active',
    type: 'Rich Media',
    health: 'Healthy',
    createdAt: '2024-01-14',
  },
  {
    id: 'TEMP-008',
    name: 'Support Follow-up',
    category: 'Support',
    status: 'Active',
    type: 'Text',
    health: 'Warning',
    createdAt: '2024-01-13',
  },
]

interface CampaignsProps {
  setCurrentPage?: (page: string) => void
}

export function Campaigns({ setCurrentPage }: CampaignsProps) {
  const [campaignCurrentPage, setCampaignCurrentPage] = useState(1)
  const [templateCurrentPage, setTemplateCurrentPage] = useState(1)
  const [templateSearchQuery, setTemplateSearchQuery] = useState('')
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('campaigns')
  const itemsPerPage = 5
  const totalPages = Math.ceil(mockCampaigns.length / itemsPerPage)
  const templateTotalPages = Math.ceil(mockTemplates.length / itemsPerPage)

  const startIndex = (campaignCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCampaigns = mockCampaigns.slice(startIndex, endIndex)

  const templateStartIndex = (templateCurrentPage - 1) * itemsPerPage
  const templateEndIndex = templateStartIndex + itemsPerPage
  const currentTemplates = mockTemplates.slice(templateStartIndex, templateEndIndex)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
      case 'Completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80'
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      case 'Paused':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
      case 'Draft':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    }
  }

  const getHealthStyles = (health: string) => {
    switch (health) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      case 'Critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Healthy':
        return <CheckCircle2 className="h-3 w-3" />
      case 'Warning':
        return <AlertTriangle className="h-3 w-3" />
      case 'Critical':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <CheckCircle2 className="h-3 w-3" />
    }
  }

  const handleCreateTemplate = () => {
    if (setCurrentPage) {
      setCurrentPage('create-template')
    }
  }

  const handleLaunchCampaign = () => {
    console.log('Launch campaign clicked')
  }

  const handleSyncStatus = () => {
    console.log('Sync status clicked')
  }

  return (
    <div className="space-y-6">
      {/* Campaigns Summary Section */}
      <div className="w-full rounded-lg bg-card p-6">
        {/* Title and Action Buttons Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Campaigns</h3>
            <p className="text-sm text-muted-foreground">
              Create, manage and track your marketing campaigns and templates.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={handleCreateTemplate}
            >
              <FileText className="h-4 w-4" />
              Create Template
            </Button>
            <Button
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={handleLaunchCampaign}
            >
              <Send className="h-4 w-4" />
              Launch Campaign
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
                    Active Campaigns
                  </div>
                  <div className="text-2xl font-medium text-foreground">4</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <CheckCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Templates</div>
                  <div className="text-2xl font-medium text-foreground">12</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <FileText className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Total Sent</div>
                  <div className="text-2xl font-medium text-foreground">12,847</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <Send className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
            <div className="border-l border-border px-6 pb-6 pt-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Avg. Delivery Rate
                  </div>
                  <div className="text-2xl font-medium text-foreground">98.2%</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                  <MessageSquare className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full rounded-lg bg-card shadow-sm">
        <Tabs defaultValue="campaigns" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between px-6 pb-4 pt-6">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger
                value="campaigns"
                className="rounded-none border-b-2 border-border/30 px-8 py-2 text-sm font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="rounded-none border-b-2 border-border/30 px-8 py-2 text-sm font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Templates
              </TabsTrigger>
            </TabsList>

            {/* Search and Sync Controls - Only show when Templates tab is active */}
            {activeTab === 'templates' && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={templateSearchQuery}
                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                    className="w-64 rounded-xl border-border bg-muted pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncStatus}
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync Status
                </Button>
              </div>
            )}

            {/* Refresh Button - Only show when Campaigns tab is active */}
            {activeTab === 'campaigns' && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={campaignSearchQuery}
                    onChange={(e) => setCampaignSearchQuery(e.target.value)}
                    className="w-64 rounded-xl border-border bg-muted pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Refresh campaigns clicked')}
                  className="gap-2 rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            )}
          </div>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="px-6 pb-6">
            {/* Campaigns Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                    <TableHead className="w-[250px] font-semibold text-primary">
                      Campaign Name
                    </TableHead>
                    <TableHead className="w-[180px] font-semibold text-primary">Template</TableHead>
                    <TableHead className="w-[120px] font-semibold text-primary">
                      Delivery Rate
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold text-primary">
                      Read Rate
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold text-primary">Status</TableHead>
                    <TableHead className="w-[140px] font-semibold text-primary">
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="min-h-[400px]">
                  {currentCampaigns.map((campaign) => (
                    <TableRow
                      key={campaign.id}
                      className="h-[80px] cursor-pointer hover:bg-muted/50"
                      onClick={() => console.log('Campaign clicked:', campaign.id)}
                    >
                      <TableCell className="w-[250px] font-medium text-foreground">
                        {campaign.name}
                      </TableCell>
                      <TableCell className="w-[180px] text-foreground">
                        {campaign.template}
                      </TableCell>
                      <TableCell className="w-[120px] text-foreground">
                        {campaign.deliveryRate}
                      </TableCell>
                      <TableCell className="w-[120px] text-foreground">
                        {campaign.readRate}
                      </TableCell>
                      <TableCell className="w-[120px]">
                        <Badge
                          variant="secondary"
                          className={`capitalize ${getStatusStyles(campaign.status)} border-0 font-medium`}
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[140px] text-muted-foreground">
                        <div className="text-sm">{campaign.createdAt}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Render empty rows to maintain consistent height */}
                  {Array.from(
                    { length: Math.max(0, itemsPerPage - currentCampaigns.length) },
                    (_, index) => (
                      <TableRow
                        key={`empty-${index}`}
                        className="h-[80px] border-0 hover:bg-transparent"
                      >
                        <TableCell className="w-[250px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[180px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[140px] border-0 p-4">&nbsp;</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Campaigns Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, mockCampaigns.length)} of{' '}
                {mockCampaigns.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (campaignCurrentPage > 1)
                            setCampaignCurrentPage(campaignCurrentPage - 1)
                        }}
                        className={
                          campaignCurrentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCampaignCurrentPage(page)
                          }}
                          isActive={campaignCurrentPage === page}
                          className="cursor-pointer"
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
                          if (campaignCurrentPage < totalPages)
                            setCampaignCurrentPage(campaignCurrentPage + 1)
                        }}
                        className={
                          campaignCurrentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="px-6 pb-6">
            {/* Templates Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                    <TableHead className="w-[200px] font-semibold text-primary">
                      Template Name
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold text-primary">Category</TableHead>
                    <TableHead className="w-[120px] font-semibold text-primary">Status</TableHead>
                    <TableHead className="w-[120px] font-semibold text-primary">Type</TableHead>
                    <TableHead className="w-[120px] font-semibold text-primary">Health</TableHead>
                    <TableHead className="w-[140px] font-semibold text-primary">
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="min-h-[400px]">
                  {currentTemplates.map((template) => (
                    <TableRow
                      key={template.id}
                      className="h-[80px] cursor-pointer hover:bg-muted/50"
                      onClick={() => console.log('Template clicked:', template.id)}
                    >
                      <TableCell className="w-[200px] font-medium text-foreground">
                        {template.name}
                      </TableCell>
                      <TableCell className="w-[140px] text-foreground">
                        {template.category}
                      </TableCell>
                      <TableCell className="w-[120px]">
                        <Badge
                          variant="secondary"
                          className={`capitalize ${getStatusStyles(template.status)} border-0 font-medium`}
                        >
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[120px] text-foreground">{template.type}</TableCell>
                      <TableCell className="w-[120px]">
                        <Badge
                          variant="secondary"
                          className={`capitalize ${getHealthStyles(template.health)} flex items-center gap-1 border-0 font-medium`}
                        >
                          {getHealthIcon(template.health)}
                          {template.health}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[140px] text-muted-foreground">
                        <div className="text-sm">{template.createdAt}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Render empty rows to maintain consistent height */}
                  {Array.from(
                    { length: Math.max(0, itemsPerPage - currentTemplates.length) },
                    (_, index) => (
                      <TableRow
                        key={`template-empty-${index}`}
                        className="h-[80px] border-0 hover:bg-transparent"
                      >
                        <TableCell className="w-[200px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[140px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[120px] border-0 p-4">&nbsp;</TableCell>
                        <TableCell className="w-[140px] border-0 p-4">&nbsp;</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Templates Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {templateStartIndex + 1} to{' '}
                {Math.min(templateEndIndex, mockTemplates.length)} of {mockTemplates.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (templateCurrentPage > 1)
                            setTemplateCurrentPage(templateCurrentPage - 1)
                        }}
                        className={
                          templateCurrentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: templateTotalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setTemplateCurrentPage(page)
                          }}
                          isActive={templateCurrentPage === page}
                          className="cursor-pointer"
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
                          if (templateCurrentPage < templateTotalPages)
                            setTemplateCurrentPage(templateCurrentPage + 1)
                        }}
                        className={
                          templateCurrentPage === templateTotalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
