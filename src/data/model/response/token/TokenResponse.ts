import { PaginationMeta } from "../../../../core/model/Pagination";
import { TokenEntity } from "@/domain/entity/token/TokenEntity";

export interface TokenListResponse {
  tokens?: SupportedTokenResponse[]; // Legacy support
  items: SupportedTokenResponse[];
  meta?: PaginationMeta;
}

export interface SupportedTokenResponse {
  id: string;
  chainId: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
  type?: string;
  isStablecoin?: boolean;
  isNative?: boolean;
  contractAddress: string;
  isActive: boolean;
  minAmount?: string;
  maxAmount?: string;
  createdAt: string;
  chain?: {
    id: string;
    name: string;
    symbol: string;
    imageUrl?: string;
  };
}

export interface CreateSupportedTokenRequest {
  chainId: string;
  tokenId: string;
  contractAddress: string;
  isActive?: boolean;
  minAmount?: string;
}

export interface UpdateSupportedTokenRequest {
  contractAddress?: string;
  isActive?: boolean;
  minAmount?: string;
}

export interface TokenFilterParams {
  chainId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
