import { apiKeyDataSource } from '../../data_source/api_key_data_source';
import type { IApiKeyRepository } from '../repository/api_key_repository';
import type { ApiResponse } from '@/core/network';
import type { CreateApiKeyRequest } from '../../model/request';
import type { CreateApiKeyResponse, ApiKeyResponse } from '../../model/response';

export class ApiKeyRepositoryImpl implements IApiKeyRepository {
  async createApiKey(request: CreateApiKeyRequest): Promise<ApiResponse<CreateApiKeyResponse>> {
    return apiKeyDataSource.createApiKey(request);
  }

  async getApiKeys(): Promise<ApiResponse<ApiKeyResponse[]>> {
    return apiKeyDataSource.getApiKeys();
  }

  async revokeApiKey(id: string): Promise<ApiResponse<void>> {
    return apiKeyDataSource.revokeApiKey(id);
  }
}

export const apiKeyRepository = new ApiKeyRepositoryImpl();
