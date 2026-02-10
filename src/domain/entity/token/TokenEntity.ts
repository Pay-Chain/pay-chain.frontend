export interface TokenEntity {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  isStablecoin: boolean;
  createdAt: string;
}

export interface SupportedTokenEntity {
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
