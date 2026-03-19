// Accessibility types for the application

export interface SkipLinkProps {
  href?: string
  text?: string
}

export interface AriaLabelProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export interface FocusableProps {
  tabIndex?: number
  onFocus?: () => void
  onBlur?: () => void
}

export interface KeyboardEventHandlers {
  onKeyPress?: (event: React.KeyboardEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onKeyUp?: (event: React.KeyboardEvent) => void
}

export interface LiveRegionProps {
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-atomic'?: boolean
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all'
}

export interface RoleProps {
  role?: string
}
