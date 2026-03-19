import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  
  // Actions
  toggle: () => void
  open: () => void
  close: () => void
  collapse: () => void
  expand: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isCollapsed: false,

  toggle: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  open: () => {
    set({ isOpen: true })
  },

  close: () => {
    set({ isOpen: false })
  },

  collapse: () => {
    set({ isCollapsed: true })
  },

  expand: () => {
    set({ isCollapsed: false })
  },
}))
