export interface RpcEntity {
  id: string;
  chainId: string;
  url: string;
  priority: number;
  isActive: boolean;
  lastErrorAt?: string;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
  chain?: {
    id: string;
    name: string;
    symbol: string;
  };
}
