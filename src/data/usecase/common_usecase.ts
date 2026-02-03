/**
 * Common Usecases - React Query hooks for chain, token, wallet, merchant
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  chainRepository,
  tokenRepository,
  walletRepository,
  merchantRepository,
  paymentRequestRepository,
} from '../repositories/repository_impl';
import type { ConnectWalletRequest, ApplyMerchantRequest, CreatePaymentRequestRequest } from '../model/request';

// ============== Chain Usecases ==============
export function useChainsQuery() {
  return useQuery({
    queryKey: ['chains'],
    queryFn: async () => {
      const response = await chainRepository.listChains();
      return response.data;
    },
  });
}

// ============== Token Usecases ==============
export function useTokensQuery() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      const response = await tokenRepository.listTokens();
      return response.data;
    },
  });
}

export function useStablecoinsQuery() {
  return useQuery({
    queryKey: ['stablecoins'],
    queryFn: async () => {
      const response = await tokenRepository.listStablecoins();
      return response.data;
    },
  });
}

// ============== Wallet Usecases ==============
export function useWalletsQuery() {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await walletRepository.listWallets();
      return response.data;
    },
  });
}

export function useConnectWalletMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConnectWalletRequest) => walletRepository.connectWallet(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}

export function useSetPrimaryWalletMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => walletRepository.setPrimaryWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}

export function useDeleteWalletMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => walletRepository.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}

// ============== Merchant Usecases ==============
export function useMerchantStatusQuery() {
  return useQuery({
    queryKey: ['merchantStatus'],
    queryFn: async () => {
      const response = await merchantRepository.getMerchantStatus();
      return response.data;
    },
  });
}

export function useApplyMerchantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ApplyMerchantRequest) => merchantRepository.applyMerchant(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantStatus'] });
    },
  });
}

// ============== Payment Request Usecases ==============
export function usePaymentRequestsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['paymentRequests', page, limit],
    queryFn: async () => {
      const response = await paymentRequestRepository.listPaymentRequests(page, limit);
      return response.data;
    },
  });
}

export function usePaymentRequestQuery(id: string) {
  return useQuery({
    queryKey: ['paymentRequest', id],
    queryFn: async () => {
      const response = await paymentRequestRepository.getPaymentRequest(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePublicPaymentRequestQuery(id: string) {
  return useQuery({
    queryKey: ['publicPaymentRequest', id],
    queryFn: async () => {
      const response = await paymentRequestRepository.getPublicPaymentRequest(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreatePaymentRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentRequestRequest) => paymentRequestRepository.createPaymentRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentRequests'] });
    },
  });
}
