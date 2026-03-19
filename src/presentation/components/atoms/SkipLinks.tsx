'use client'

import { SkipLinkProps } from '@/data/model/entity/accessibility'

/**
 * SkipLink - Accessibility skip link for keyboard users
 * Allows users to skip repetitive navigation and jump to main content
 */
export function SkipLink({ href = '#main-content', text = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {text}
    </a>
  )
}

/**
 * SkipLinks - Multiple skip links for different sections
 */
export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content" text="Skip to main content" />
      <SkipLink href="#sidebar-nav" text="Skip to navigation" />
      <SkipLink href="#search" text="Skip to search" />
    </>
  )
}
