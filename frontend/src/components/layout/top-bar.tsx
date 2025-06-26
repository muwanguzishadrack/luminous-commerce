import { Bell, Menu, ChevronDown, Search, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '../../contexts/AuthContext'
import { useOrganization } from '../../contexts/OrganizationContext'

export function TopBar() {
  const { user, logout } = useAuth()
  const { organization } = useOrganization()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header
      className="flex items-center justify-between border-b border-border bg-sidebar px-6"
      style={{ height: '66px' }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-xl md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="rounded-xl pl-10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Center section - Organization name */}
      <div className="flex-1 text-center">
        {organization && (
          <p className="text-sm font-medium text-gray-700">{organization.name}</p>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-xl p-2"
          style={{ backgroundColor: '#e9eae5' }}
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-2 flex items-center gap-2 h-auto p-2">
              <img
                src="/Luminous-CRM-Logo.jpg"
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-normal text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'Loading...'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
