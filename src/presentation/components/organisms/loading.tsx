'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/core/utils'

interface LoadingOverlayProps {
  text?: string
  className?: string
}

export function LoadingOverlay({ text = 'Loading...', className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

export function LoadingSpinner({ 
  size = 'md', 
  text,
  fullScreen = false 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} aria-hidden="true" />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}

export function InlineSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  }
  
  return <Loader2 className={cn('animate-spin', sizes[size])} aria-hidden="true" />
}
