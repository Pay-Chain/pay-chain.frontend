import { httpClient, ApiResponse } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constants/api_endpoints';
import type { CreateApiKeyRequest } from '../model/request';
import type { CreateApiKeyResponse, ApiKeyResponse } from '../model/response';

export class ApiKeyDataSource {
  async createApiKey(request: CreateApiKeyRequest): Promise<ApiResponse<CreateApiKeyResponse>> {
    return httpClient.post<CreateApiKeyResponse>(API_ENDPOINTS.API_KEYS, request);
  }

  async getApiKeys(): Promise<ApiResponse<ApiKeyResponse[]>> {
    return httpClient.get<ApiKeyResponse[]>(API_ENDPOINTS.API_KEYS);
  }

  async revokeApiKey(id: string): Promise<ApiResponse<void>> {
    const url = API_ENDPOINTS.API_KEY_BY_ID(id);
    return httpClient.delete<void>(url);
  }
}

export const apiKeyDataSource = new ApiKeyDataSource();
