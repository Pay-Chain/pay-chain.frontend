import type { ApiResponse } from '@/core/network';
import type { CreateApiKeyRequest } from '../../model/request';
import type { CreateApiKeyResponse, ApiKeyResponse } from '../../model/response';

export interface IApiKeyRepository {
  createApiKey(request: CreateApiKeyRequest): Promise<ApiResponse<CreateApiKeyResponse>>;
  getApiKeys(): Promise<ApiResponse<ApiKeyResponse[]>>;
  revokeApiKey(id: string): Promise<ApiResponse<void>>;
}
