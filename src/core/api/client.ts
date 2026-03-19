import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Helper function to get user-friendly error messages
function getErrorMessage(error: AxiosError): string {
  // Network errors
  if (!navigator.onLine) {
    return 'You appear to be offline. Please check your internet connection.'
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.'
  }

  // HTTP errors
  const status = error.response?.status
  
  if (status === 401) {
    return 'Your session has expired. Please log in again.'
  }
  
  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }
  
  if (status === 404) {
    return 'The requested resource was not found.'
  }
  
  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  
  if (status && status >= 500) {
    return 'Server error. Please try again later.'
  }

  // Default error message
  return (error as any).message || 'An unexpected error occurred. Please try again.'
}

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error)
    
    // Show toast notification for errors (except 401 which redirects)
    if (error.response?.status !== 401) {
      // Import toast dynamically to avoid circular dependencies
      import('sonner').then(({ toast }) => {
        toast.error('Error', {
          description: message,
          duration: 5000,
        })
      })
    }
    
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)
