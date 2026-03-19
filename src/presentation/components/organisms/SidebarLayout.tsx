'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LucideIcon, Menu, X, LogOut, User } from 'lucide-react'
import { cn } from '@/core/utils'
import { Button } from '../atoms'

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
}

export interface SidebarLayoutProps {
  navigation: NavigationItem[]
  title: string
  logo?: React.ReactNode
  children: React.ReactNode
  headerContent?: React.ReactNode
  user?: {
    name: string
    email: string
  }
  showVersion?: boolean
  version?: string
}

export function SidebarLayout({
  navigation,
  title,
  logo,
  children,
  headerContent,
  user,
  showVersion = false,
  version = 'v2.0.0',
}: SidebarLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center gap-2">
              {logo || (
                <>
                  <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">
                      {title.charAt(0)}
                    </span>
                  </div>
                  <h1 className="text-lg font-bold">{title}</h1>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2" role="navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          {user && (
            <div className="p-4 border-t space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold"
                  aria-hidden="true"
                >
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                size="sm"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6"
          aria-label="Top navigation"
        >
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {headerContent && <div className="flex items-center gap-2">{headerContent}</div>}
          {showVersion && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded"
                aria-label={`Version ${version}`}
              >
                {version}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
