import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiKeyRepository } from '../repositories/repository_impl/api_key_repository_impl';
import type { CreateApiKeyRequest } from '../model/request';

export function useApiKeysQuery() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await apiKeyRepository.getApiKeys();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });
}

export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateApiKeyRequest) => {
      const response = await apiKeyRepository.createApiKey(request);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
}

export function useRevokeApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiKeyRepository.revokeApiKey(id);
      if (response.error) throw new Error(response.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
}
