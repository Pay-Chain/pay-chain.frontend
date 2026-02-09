import { PaginationMeta } from "../../../../core/model/Pagination";

export interface RpcListResponse {
  rpcs?: RpcResponse[]; // Legacy support
  items: RpcResponse[];
  meta?: PaginationMeta;
}

export interface RpcResponse {
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

export interface CreateRpcRequest {
  chainId: string;
  url: string;
  priority?: number;
  isActive?: boolean;
}

export interface UpdateRpcRequest {
  url?: string;
  priority?: number;
  isActive?: boolean;
}

export interface RpcFilterParams {
  chainId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
