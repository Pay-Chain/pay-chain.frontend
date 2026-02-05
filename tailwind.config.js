/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Solana-inspired color palette
        background: '#0D0D0D',
        surface: '#1A1A1A',
        foreground: '#FAFAFA',
        muted: '#848895',
        border: 'rgba(255, 255, 255, 0.1)',
        
        // Accent colors (neon gradients)
        accent: {
          purple: '#9945FF',
          green: '#14F195',
          blue: '#00C2FF',
        },
        
        // Semantic colors
        primary: {
          DEFAULT: '#9945FF',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#9945FF',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        success: {
          DEFAULT: '#14F195',
          500: '#14F195',
        },
        info: {
          DEFAULT: '#00C2FF',
          500: '#00C2FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-solana': 'linear-gradient(135deg, #9945FF 0%, #14F195 50%, #00C2FF 100%)',
        'gradient-purple-green': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #9945FF 0%, #00C2FF 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, #9945FF33 0px, transparent 50%), radial-gradient(at 80% 0%, #14F19533 0px, transparent 50%), radial-gradient(at 0% 50%, #00C2FF33 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-purple': '0 0 60px rgba(153, 69, 255, 0.3)',
        'glow-green': '0 0 60px rgba(20, 241, 149, 0.3)',
        'glow-blue': '0 0 60px rgba(0, 194, 255, 0.3)',
        'glow-sm': '0 0 20px rgba(153, 69, 255, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(153, 69, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(153, 69, 255, 0.5)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
