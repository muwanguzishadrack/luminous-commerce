import {
  LayoutDashboard,
  MessageSquareMore,
  ShoppingCart,
  Package,
  Wallet,
  Megaphone,
  UsersRound,
  ReceiptText,
  Workflow,
  Settings,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useOrganization } from '../../contexts/OrganizationContext'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
  { icon: MessageSquareMore, label: 'Chat', page: 'chat' },
  { icon: ShoppingCart, label: 'Orders', page: 'orders' },
  { icon: Package, label: 'Products', page: 'products' },
  { icon: UsersRound, label: 'Customers', page: 'customers' },
  { icon: Megaphone, label: 'Campaigns', page: 'campaigns' },
  { icon: ReceiptText, label: 'Transactions', page: 'transactions' },
  { icon: Wallet, label: 'Wallet', page: 'wallet' },
]

const bottomNavigationItems = [
  { icon: Workflow, label: 'Flows', page: 'flows' },
  { icon: Settings, label: 'Settings', page: 'settings' },
]

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { organization } = useOrganization()
  return (
    <div className="mb-2 ml-2 mt-2 flex w-64 flex-col rounded-lg border border-border bg-sidebar">
      {/* Logo section */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/Luminous-CRM-Logo.svg" alt="Luminous CRM" className="h-6 w-auto" />
        </div>
      </div>

      {/* Store Selection */}
      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: '#e9eae5' }}
          >
            <ShoppingBag
              className="h-5 w-5 text-gray-700"
              style={{ width: '18px', height: '18px' }}
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-normal text-gray-900">Business</p>
            <p className="text-xs text-gray-500">{organization?.name || ''}</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(item.page)}
                className={cn(
                  'h-10 w-full justify-start gap-3 rounded-xl px-3 font-normal',
                  currentPage === item.page
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-4">
        <ul className="space-y-2">
          {bottomNavigationItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(item.page)}
                className={cn(
                  'h-10 w-full justify-start gap-3 rounded-xl px-3 font-normal',
                  currentPage === item.page
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
