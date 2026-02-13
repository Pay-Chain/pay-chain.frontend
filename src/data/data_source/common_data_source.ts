/**
 * Common Data Source
 * Acts as HTTP connector for Chain, Token, Wallet, Merchant, PaymentRequest
 */
import { httpClient } from '@/core/network';
import type { ApiResponse } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constant';
import type {
  ConnectWalletRequest,
  ApplyMerchantRequest,
  CreatePaymentRequestRequest,
} from '../model/request';
import type {
  ChainsResponse,
  TokensResponse,
  WalletResponse,
  WalletsResponse,
  MerchantStatusResponse,
  MessageResponse,
  PaymentRequestResponse,
  PaymentRequestsResponse,
} from '../model/response';
import type { Merchant } from '../model/entity';

// ============== Chain Data Source ==============
class ChainDataSource {
  async list() {
    return httpClient.get<ChainsResponse>(API_ENDPOINTS.CHAINS);
  }
}

export const chainDataSource = new ChainDataSource();

// ============== Token Data Source ==============
class TokenDataSource {
  async list() {
    return httpClient.get<TokensResponse>(API_ENDPOINTS.TOKENS);
  }

  async listStablecoins() {
    return httpClient.get<TokensResponse>(API_ENDPOINTS.TOKENS_STABLECOINS);
  }
}

export const tokenDataSource = new TokenDataSource();

// ============== Wallet Data Source ==============
class WalletDataSource {
  async list() {
    return httpClient.get<WalletsResponse>(API_ENDPOINTS.WALLETS);
  }

  async connect(request: ConnectWalletRequest) {
    return httpClient.post<WalletResponse>(API_ENDPOINTS.WALLET_CONNECT, request);
  }

  async setPrimary(id: string) {
    return httpClient.put<WalletResponse>(API_ENDPOINTS.WALLET_PRIMARY(id), {});
  }

  async delete(id: string) {
    return httpClient.delete<MessageResponse>(API_ENDPOINTS.WALLET_BY_ID(id));
  }
}

export const walletDataSource = new WalletDataSource();

// ============== Merchant Data Source ==============
class MerchantDataSource {
  async apply(request: ApplyMerchantRequest) {
    return httpClient.post<Merchant>(API_ENDPOINTS.MERCHANT_APPLY, request);
  }

  async getStatus() {
    return httpClient.get<MerchantStatusResponse>(API_ENDPOINTS.MERCHANT_STATUS);
  }
}

export const merchantDataSource = new MerchantDataSource();

// ============== Payment Request Data Source ==============
class PaymentRequestDataSource {
  async create(request: CreatePaymentRequestRequest) {
    return httpClient.post<PaymentRequestResponse>(API_ENDPOINTS.PAYMENT_REQUESTS, request);
  }

  async getById(id: string) {
    return httpClient.get<PaymentRequestResponse>(API_ENDPOINTS.PAYMENT_REQUEST_BY_ID(id));
  }

  async list(page = 1, limit = 10) {
    return httpClient.get<PaymentRequestsResponse>(
      `${API_ENDPOINTS.PAYMENT_REQUESTS}?page=${page}&limit=${limit}`
    );
  }

  async getPublic(id: string): Promise<ApiResponse<PaymentRequestResponse>> {
    return httpClient.get<PaymentRequestResponse>(API_ENDPOINTS.PAY_PUBLIC(id));
  }
}

export const paymentRequestDataSource = new PaymentRequestDataSource();
