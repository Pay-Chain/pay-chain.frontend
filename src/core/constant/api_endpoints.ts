// API Endpoints - All backend routes
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/v1/auth/register',
  AUTH_LOGIN: '/v1/auth/login',
  AUTH_VERIFY_EMAIL: '/v1/auth/verify-email',
  AUTH_REFRESH: '/v1/auth/refresh',
  AUTH_ME: '/v1/auth/me',
  AUTH_CHANGE_PASSWORD: '/v1/auth/change-password',

  // Payments
  PAYMENTS: '/v1/payments',
  PAYMENT_BY_ID: (id: string) => `/v1/payments/${id}`,
  PAYMENT_EVENTS: (id: string) => `/v1/payments/${id}/events`,

  // Payment Requests
  PAYMENT_REQUESTS: '/v1/payment-requests',
  PAYMENT_REQUEST_BY_ID: (id: string) => `/v1/payment-requests/${id}`,
  PAY_PUBLIC: (id: string) => `/v1/pay/${id}`,

  // Wallets
  WALLETS: '/v1/wallets',
  WALLET_CONNECT: '/v1/wallets/connect',
  WALLET_PRIMARY: (id: string) => `/v1/wallets/${id}/primary`,
  WALLET_BY_ID: (id: string) => `/v1/wallets/${id}`,

  // Merchants
  MERCHANT_APPLY: '/v1/merchants/apply',
  MERCHANT_STATUS: '/v1/merchants/status',

  // Admin
  ADMIN_STATS: '/v1/admin/stats',
  ADMIN_USERS: '/v1/admin/users',
  ADMIN_MERCHANTS: '/v1/admin/merchants',
  ADMIN_MERCHANT_STATUS: (id: string) => `/v1/admin/merchants/${id}/status`,
  ADMIN_CHAINS: '/v1/admin/chains',
  ADMIN_CHAIN_BY_ID: (id: number | string) => `/v1/admin/chains/${id}`,
  ADMIN_RPCS: '/v1/admin/rpcs',
  ADMIN_TOKENS: '/v1/admin/tokens',
  ADMIN_TEAMS: '/v1/admin/teams',
  ADMIN_TEAM_BY_ID: (id: string) => `/v1/admin/teams/${id}`,

  // Chains
  CHAINS: '/v1/chains',

  // Tokens
  TOKENS: '/v1/tokens',
  TOKENS_STABLECOINS: '/v1/tokens/stablecoins',

  // Teams
  TEAMS: '/v1/teams',

  // Smart Contracts
  CONTRACTS: '/v1/contracts',
  CONTRACT_BY_ID: (id: string) => `/v1/contracts/${id}`,
  CONTRACT_LOOKUP: '/v1/contracts/lookup',

  // Webhooks (internal)
  WEBHOOK_INDEXER: '/v1/webhooks/indexer',

  // API Keys
  API_KEYS: '/v1/api-keys',
  API_KEY_BY_ID: (id: string) => `/v1/api-keys/${id}`,

  // Payment App (Public)
  PAYMENT_APP: '/v1/payment-app',
} as const;
