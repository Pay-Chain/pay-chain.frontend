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
  tokenId: string;
  contractAddress: string;
  isActive: boolean;
  minAmount?: string;
  createdAt: string;
  token?: TokenEntity;
  chain?: {
    id: string;
    name: string;
    symbol: string;
  };
}
