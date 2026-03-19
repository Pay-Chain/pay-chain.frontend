import dynamic from 'next/dynamic'
import React from 'react'

interface LazyLoadOptions {
  ssr?: boolean
  loading?: boolean
}

function LoadingFallback() {
  return React.createElement(
    'div',
    { className: 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center' },
    React.createElement('div', { className: 'h-8 w-8 animate-spin rounded-md border-4 border-primary border-t-transparent' })
  )
}

/**
 * Lazy load a component with automatic loading state
 */
export function lazyLoad(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  options: LazyLoadOptions = {}
) {
  const {
    ssr = true,
    loading = true,
  } = options

  return dynamic(importFn, {
    loading: loading ? LoadingFallback : undefined,
    ssr,
  })
}

/**
 * Lazy load a page component
 */
export function lazyLoadPage(
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) {
  return lazyLoad(importFn, {
    ssr: false,
    loading: true,
  })
}

/**
 * Prefetch a lazy loaded component
 */
export async function prefetchComponent<T>(
  importFn: () => Promise<T>
): Promise<void> {
  await importFn()
}
