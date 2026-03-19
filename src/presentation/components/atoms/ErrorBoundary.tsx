'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'


interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                <h3 className="text-lg font-semibold">Something went wrong</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We're sorry, but something went wrong. Please try refreshing the page.
              </p>

              {this.state.error && (
                <div className="p-3 bg-muted rounded text-xs font-mono text-muted-foreground overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
              <Button onClick={this.handleRetry} className="w-full">
                <RefreshCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                Refresh Page
              </Button>
            </div>
          </Card>

        </div>
      )
    }

    return this.props.children
  }
}

/**
 * ErrorFallback - Reusable error fallback component
 */
export function ErrorFallback({
  error,
  onRetry,
}: {
  error?: Error
  onRetry?: () => void
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            <h3 className="text-lg font-semibold">Error Loading Content</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            We couldn't load this content. Please try again.
          </p>
          {error && (
            <div className="p-3 bg-muted rounded text-xs font-mono text-muted-foreground overflow-x-auto">
              {error.message}
            </div>
          )}
          <Button onClick={onRetry} className="w-full">
            <RefreshCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </Card>
    </div>

  )
}
