/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // use.ink inspired purple palette
                ink: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8C7CF7', // Primary lavender
                    600: '#8647CB', // Primary purple
                    700: '#7c3aed',
                    800: '#6d28d9',
                    900: '#5b21b6',
                    950: '#2e1065',
                },
                // Background colors
                base: {
                    DEFAULT: '#0a0a0f',
                    50: '#18181b',
                    100: '#121217',
                    200: '#0f0f14',
                    300: '#0a0a0f',
                },
                // Accent yellow for highlights
                accent: {
                    DEFAULT: '#ffc249',
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#ffc249',
                    500: '#f59e0b',
                },
                // Glass effect colors
                glass: {
                    light: 'rgba(139, 92, 246, 0.08)',
                    medium: 'rgba(139, 92, 246, 0.12)',
                    heavy: 'rgba(139, 92, 246, 0.20)',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
            },
            fontFamily: {
                sans: ['Montserrat', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                '2xl': '16px',
                '3xl': '24px',
                '4xl': '32px',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 24px rgba(0, 0, 0, 0.3)',
                'glass-hover': 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(139, 92, 246, 0.25)',
                'glow': '0 0 40px rgba(140, 124, 247, 0.3)',
                'glow-sm': '0 0 20px rgba(140, 124, 247, 0.2)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
        },
    },
    plugins: [],
};
