import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface NotificationState {
  toasts: Toast[]
  
  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Convenience methods
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { 
      id, 
      duration: 5000, 
      ...toast 
    }
    
    set((state) => ({ 
      toasts: [...state.toasts, newToast] 
    }))

    // Auto-remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },

  success: (title, description) => {
    get().addToast({ type: 'success', title, description })
  },

  error: (title, description) => {
    get().addToast({ type: 'error', title, description })
  },

  warning: (title, description) => {
    get().addToast({ type: 'warning', title, description })
  },

  info: (title, description) => {
    get().addToast({ type: 'info', title, description })
  },
}))
