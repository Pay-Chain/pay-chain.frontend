import type { User, Payment, PaymentEvent, Chain, Token, SupportedToken, Wallet, PaymentRequest } from '../entity';

// Auth responses
export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}

// Payment responses
export interface CreatePaymentResponse {
  paymentId: string;
  status: string;
  sourceAmount: string;
  destAmount: string;
  feeAmount: string;
  bridgeType?: string;
  feeBreakdown: {
    platformFee: string;
    bridgeFee: string;
    gasFee: string;
    totalFee: string;
    netAmount: string;
  };
  signatureData?: {
    to?: string;
    data?: string;
    programId?: string;
  };
}

export interface PaymentResponse {
  payment: Payment;
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: Pagination;
}

export interface PaymentEventsResponse {
  events: PaymentEvent[];
}

// Chain & Token responses
export interface ChainsResponse {
  items: Chain[];
  meta: Pagination;
}

export interface TokensResponse {
  items: Token[] | SupportedToken[];
  meta: Pagination;
}

// Wallet responses
export interface WalletResponse {
  wallet: Wallet;
}

export interface WalletsResponse {
  wallets: Wallet[];
}

// Merchant responses
export interface MerchantStatusResponse {
  status: string;
  merchantType?: string;
  businessName?: string;
  message: string;
}

// Payment Request responses
export interface PaymentRequestResponse {
  requestId: string;
  txData: {
    hex?: string;
    base64?: string;
    to?: string;
    programId?: string;
  };
  contractAddress: string;
  amount: string;
  decimals: number;
  chainId: string;
  expiresAt: string;
}

export interface PaymentRequestsResponse {
  paymentRequests: PaymentRequest[];
  pagination: Pagination;
}

// Common
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
