// Auth requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  walletAddress?: string;
  walletChainId?: string;
  walletSignature?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// Payment requests
export interface CreatePaymentRequest {
  sourceChainId: string;
  destChainId: string;
  sourceTokenAddress: string;
  destTokenAddress: string;
  amount: string;
  receiverAddress: string;
  decimals: number;
}

// Payment request requests
export interface CreatePaymentRequestRequest {
  chainId: string;
  tokenAddress: string;
  amount: string;
  decimals: number;
  description?: string;
}

// Wallet requests
export interface ConnectWalletRequest {
  chainId: string;
  address: string;
  signature: string;
}

// Merchant requests
export interface ApplyMerchantRequest {
  businessName: string;
  businessEmail: string;
  merchantType: string;
  taxId?: string;
  businessAddress?: string;
}
