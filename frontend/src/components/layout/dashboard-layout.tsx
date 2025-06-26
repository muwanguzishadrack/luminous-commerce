import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

interface DashboardLayoutProps {
  children: ReactNode
  currentPage: string
  setCurrentPage: (page: string) => void
}

export function DashboardLayout({ children, currentPage, setCurrentPage }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-sidebar">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar - Hidden on chat page */}
          {currentPage !== 'chat' && <TopBar />}

          {/* Page content */}
          <main
            className={`flex-1 overflow-y-auto bg-sidebar ${
              currentPage !== 'chat' ? 'p-6' : 'p-2'
            }`}
          >
            {currentPage === 'chat' ? (
              <div className="h-full max-h-screen" style={{ height: 'calc(100vh - 16px)' }}>
                {children}
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
