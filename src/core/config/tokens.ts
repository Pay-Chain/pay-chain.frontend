/**
 * Design Tokens for Payment Kita Frontend
 * 
 * Centralized design system configuration
 * Use these tokens for consistent styling across the application
 */

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
  // Padding/Margin scale
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  
  // Page layouts
  pagePadding: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },
  
  // Component spacing
  componentGap: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const

// ============================================================================
// COLORS
// ============================================================================

export const COLORS = {
  // Semantic colors
  semantic: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    secondary: 'hsl(210 40% 96.1%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    success: 'hsl(142.1 76.2% 36.3%)',
    warning: 'hsl(38 92% 50%)',
    info: 'hsl(201.4 90% 36.1%)',
  },
  
  // Background colors
  background: {
    default: 'hsl(0 0% 100%)',
    muted: 'hsl(210 40% 96.1%)',
    card: 'hsl(0 0% 100%)',
    popover: 'hsl(0 0% 100%)',
  },
  
  // Foreground colors
  foreground: {
    default: 'hsl(222.2 84% 4.9%)',
    muted: 'hsl(215.4 16.3% 46.9%)',
    inverted: 'hsl(210 40% 98%)',
  },
  
  // Border colors
  border: {
    default: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(221.2 83.2% 53.3%)',
  },
  
  // Status colors
  status: {
    success: 'hsl(142.1 76.2% 36.3%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84.2% 60.2%)',
    info: 'hsl(201.4 90% 36.1%)',
  },
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.25rem',    // 4px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const

// ============================================================================
// SHADOWS
// ============================================================================

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const

// ============================================================================
// Z-INDEX
// ============================================================================

export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const

// ============================================================================
// TRANSITIONS
// ============================================================================

export const TRANSITIONS = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  
  // Timing functions
  timing: {
    ease: 'ease',
    linear: 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
  },
  
  // Properties
  properties: {
    all: 'all',
    colors: 'background-color, border-color, color',
    transform: 'transform',
    opacity: 'opacity',
    shadow: 'box-shadow',
  },
} as const

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px', // 2X Extra large devices
} as const

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const COMPONENT_TOKENS = {
  // Button
  button: {
    height: {
      sm: '2.25rem',
      md: '2.5rem',
      lg: '2.75rem',
    },
    padding: {
      sm: '0.75rem',
      md: '1rem',
      lg: '2rem',
    },
  },
  
  // Input
  input: {
    height: {
      sm: '2.25rem',
      md: '2.5rem',
      lg: '2.75rem',
    },
  },
  
  // Card
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    borderRadius: '0.5rem',
  },
  
  // Badge
  badge: {
    fontSize: '0.75rem',
    padding: {
      x: '0.5rem',
      y: '0.125rem',
    },
    borderRadius: '9999px',
  },
} as const

// ============================================================================
// ANIMATIONS
// ============================================================================

export const ANIMATIONS = {
  // Keyframes would be defined in CSS
  // These are the names to use
  keyframes: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    slideIn: 'slideIn',
    slideOut: 'slideOut',
    scaleIn: 'scaleIn',
    scaleOut: 'scaleOut',
    spin: 'spin',
    pulse: 'pulse',
    bounce: 'bounce',
  },
  
  // Duration
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
} as const

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const ACCESSIBILITY = {
  // Focus ring
  focusRing: {
    width: '2px',
    offset: '2px',
    color: COLORS.semantic.primary,
  },
  
  // Minimum touch target size
  touchTarget: {
    min: '2.5rem', // 44px (WCAG recommendation)
    comfortable: '2.75rem', // 48px
  },
  
  // Minimum contrast ratios
  contrastRatio: {
    AA: 4.5,
    AAA: 7,
    AALarge: 3,
    AAALarge: 4.5,
  },
} as const

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const tokens = {
  spacing: SPACING,
  typography: TYPOGRAPHY,
  colors: COLORS,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  zIndex: Z_INDEX,
  transitions: TRANSITIONS,
  breakpoints: BREAKPOINTS,
  componentTokens: COMPONENT_TOKENS,
  animations: ANIMATIONS,
  accessibility: ACCESSIBILITY,
} as const

export type Tokens = typeof tokens
