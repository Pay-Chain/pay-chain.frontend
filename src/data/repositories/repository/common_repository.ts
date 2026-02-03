/**
 * Common Repository Interfaces
 */
import type { ApiResponse } from '@/core/network';
import type { ConnectWalletRequest, ApplyMerchantRequest } from '../../model/request';
import type {
  ChainsResponse,
  TokensResponse,
  WalletResponse,
  WalletsResponse,
  MerchantStatusResponse,
  MessageResponse,
} from '../../model/response';
import type { Merchant } from '../../model/entity';

// ============== Chain Repository ==============
export interface IChainRepository {
  listChains(): Promise<ApiResponse<ChainsResponse>>;
}

// ============== Token Repository ==============
export interface ITokenRepository {
  listTokens(): Promise<ApiResponse<TokensResponse>>;
  listStablecoins(): Promise<ApiResponse<TokensResponse>>;
}

// ============== Wallet Repository ==============
export interface IWalletRepository {
  listWallets(): Promise<ApiResponse<WalletsResponse>>;
  connectWallet(input: ConnectWalletRequest): Promise<ApiResponse<WalletResponse>>;
  setPrimaryWallet(id: string): Promise<ApiResponse<WalletResponse>>;
  deleteWallet(id: string): Promise<ApiResponse<MessageResponse>>;
}

// ============== Merchant Repository ==============
export interface IMerchantRepository {
  applyMerchant(input: ApplyMerchantRequest): Promise<ApiResponse<Merchant>>;
  getMerchantStatus(): Promise<ApiResponse<MerchantStatusResponse>>;
}
