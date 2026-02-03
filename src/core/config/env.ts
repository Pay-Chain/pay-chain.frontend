// Environment configuration
export const ENV = {
  // API base URL - uses proxy route for client-side, direct backend for server-side
  API_BASE_URL: '/api',
  
  // Backend URL for server-side direct calls (only available server-side)
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8080',
  
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;
