import React from 'react'
import { Settings as SettingsIcon, MessageSquare } from 'lucide-react'

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      icon: SettingsIcon,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Settings',
      icon: MessageSquare,
    },
  ]

  return (
    <div>
      {/* Settings Title Section */}
      <div
        className="border-b border-border px-6"
        style={{ paddingTop: '16px', paddingBottom: '23px' }}
      >
        <h3 className="text-xl font-semibold text-foreground">Settings</h3>
        <p className="mt-1 text-sm text-muted-foreground">Update your organization settings</p>
      </div>

      {/* Navigation Menu */}
      <div className="p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`h-10 w-full flex items-center justify-start gap-3 rounded-xl px-3 font-normal text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary/30 text-secondary-foreground hover:bg-secondary/40'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SettingsSidebar
