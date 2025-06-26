import { Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '../../contexts/AuthContext'
import { ProfileDialog } from './ProfileDialog'
import { useState } from 'react'

export function TopBar() {
  const { user, logout } = useAuth()
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleProfileClick = () => {
    setProfileDialogOpen(true)
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

      </div>

      {/* Center section - Empty spacer */}
      <div className="flex-1">
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="ml-2 flex h-auto items-center gap-2 p-2 hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#e9eae5' }}
              >
                <User style={{ width: '18px', height: '18px' }} />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-normal text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || 'Loading...'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
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

      {/* Profile Dialog */}
      <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
    </header>
  )
}
