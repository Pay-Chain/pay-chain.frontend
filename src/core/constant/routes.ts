// Frontend Routes
export const ROUTES = {
  // Public
  HOME: '/',
  PAY: (id: string) => `/pay/${id}`,

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/dashboard',
  PAYMENTS: '/payments',
  NEW_PAYMENT: '/payments/new',
  PAYMENT_DETAIL: (id: string) => `/payments/${id}`,

  PAYMENT_REQUESTS: '/payment-requests',
  WALLETS: '/wallets',
  MERCHANT: '/merchant',
  SETTINGS: '/settings',
} as const;
