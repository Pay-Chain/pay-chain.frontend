import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  actualTheme: 'light' | 'dark'
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getActualTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') return getSystemTheme()
  return theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const root = document.documentElement
        const actualTheme = getActualTheme(theme)
        
        root.classList.remove('light', 'dark')
        root.classList.add(actualTheme)
        
        set({ 
          theme, 
          actualTheme: getActualTheme(theme) 
        })
      },

      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

// Initialize theme on mount
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme-storage')
  const theme: Theme = storedTheme ? JSON.parse(storedTheme).state.theme : 'system'
  const actualTheme = getActualTheme(theme)
  
  document.documentElement.classList.add(actualTheme)
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const stored = localStorage.getItem('theme-storage')
    const theme: Theme = stored ? JSON.parse(stored).state.theme : 'system'
    
    if (theme === 'system') {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(e.matches ? 'dark' : 'light')
    }
  })
}
