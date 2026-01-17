const API_BASE = '/api';

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    kycStatus: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface Payment {
    paymentId: string;
    senderId: string;
    merchantId?: string;
    sourceChainId: string;
    destChainId: string;
    sourceTokenAddress: string;
    destTokenAddress: string;
    sourceAmount: string;
    destAmount: string;
    feeAmount: string;
    status: string;
    bridgeType?: string;
    sourceTxHash?: string;
    destTxHash?: string;
    receiverAddress: string;
    decimals: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentEvent {
    id: string;
    paymentId: string;
    eventType: string;
    chain: string;
    txHash?: string;
    blockNumber?: number;
    createdAt: string;
}

export interface Chain {
    id: number;
    caip2: string;
    name: string;
    chainType: string;
    explorerUrl: string;
    isActive: boolean;
}

export interface Token {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
    logoUrl?: string;
    isStablecoin: boolean;
}

export interface SupportedToken extends Token {
    chainId: number;
    contractAddress: string;
    minAmount: string;
    maxAmount: string;
}

export interface Wallet {
    id: string;
    userId: string;
    chainId: string;
    address: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface MerchantStatus {
    status: string;
    merchantType?: string;
    businessName?: string;
    message: string;
}

export interface CreatePaymentInput {
    sourceChainId: string;
    destChainId: string;
    sourceTokenAddress: string;
    destTokenAddress: string;
    amount: string;
    receiverAddress: string;
    decimals: number;
}

export interface CreatePaymentResponse {
    paymentId: string;
    status: string;
    sourceAmount: string;
    destAmount: string;
    feeAmount: string;
    bridgeType?: string;
    feeBreakdown: {
        platformFee: number;
        bridgeFee: number;
        totalFee: number;
        netAmount: number;
    };
}

class ApiClient {
    private accessToken: string | null = null;

    setAccessToken(token: string | null) {
        this.accessToken = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (this.accessToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: data.error || 'Request failed' };
            }

            return { data };
        } catch (error) {
            return { error: 'Network error' };
        }
    }

    // Auth
    async register(name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
        return this.request('/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
        return this.request('/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
        return this.request('/v1/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
        return this.request('/v1/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    // Payments
    async createPayment(input: CreatePaymentInput): Promise<ApiResponse<CreatePaymentResponse>> {
        return this.request('/v1/payments', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    }

    async getPayment(id: string): Promise<ApiResponse<{ payment: Payment }>> {
        return this.request(`/v1/payments/${id}`);
    }

    async listPayments(page = 1, limit = 10): Promise<ApiResponse<{ payments: Payment[]; pagination: any }>> {
        return this.request(`/v1/payments?page=${page}&limit=${limit}`);
    }

    async getPaymentEvents(paymentId: string): Promise<ApiResponse<{ events: PaymentEvent[] }>> {
        return this.request(`/v1/payments/${paymentId}/events`);
    }

    // Chains
    async listChains(): Promise<ApiResponse<{ chains: Chain[] }>> {
        return this.request('/v1/chains');
    }

    // Tokens
    async listTokens(chainId?: number): Promise<ApiResponse<{ tokens: Token[] | SupportedToken[] }>> {
        const query = chainId ? `?chainId=${chainId}` : '';
        return this.request(`/v1/tokens${query}`);
    }

    // Wallets
    async connectWallet(chainId: string, address: string, signature: string): Promise<ApiResponse<{ wallet: Wallet }>> {
        return this.request('/v1/wallets/connect', {
            method: 'POST',
            body: JSON.stringify({ chainId, address, signature }),
        });
    }

    async listWallets(): Promise<ApiResponse<{ wallets: Wallet[] }>> {
        return this.request('/v1/wallets');
    }

    async setPrimaryWallet(walletId: string): Promise<ApiResponse<{ message: string }>> {
        return this.request(`/v1/wallets/${walletId}/primary`, {
            method: 'PUT',
        });
    }

    async disconnectWallet(walletId: string): Promise<ApiResponse<{ message: string }>> {
        return this.request(`/v1/wallets/${walletId}`, {
            method: 'DELETE',
        });
    }

    // Merchants
    async applyMerchant(input: {
        businessName: string;
        businessEmail: string;
        merchantType: string;
        taxId?: string;
        businessAddress?: string;
    }): Promise<ApiResponse<MerchantStatus>> {
        return this.request('/v1/merchants/apply', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    }

    async getMerchantStatus(): Promise<ApiResponse<MerchantStatus>> {
        return this.request('/v1/merchants/status');
    }

    // Smart Contracts
    async listContracts(chainId?: string): Promise<ApiResponse<{ contracts: any[] }>> {
        const query = chainId ? `?chainId=${chainId}` : '';
        return this.request(`/v1/contracts${query}`);
    }

    async getContract(id: string): Promise<ApiResponse<{ contract: any }>> {
        return this.request(`/v1/contracts/${id}`);
    }
}

export const api = new ApiClient();
