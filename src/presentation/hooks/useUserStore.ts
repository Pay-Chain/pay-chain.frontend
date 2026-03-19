import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  user: {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
  } | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: UserState['user'], token?: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateProfile: (profile: Partial<UserState['user']>) => void
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user, token) => {
        if (token) {
          localStorage.setItem('token', token)
        }
        set({ 
          user, 
          token: token || null, 
          isAuthenticated: !!user,
          isLoading: false 
        })
      },

      logout: () => {
        localStorage.removeItem('token')
        set(initialState)
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      updateProfile: (profile) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }))
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
