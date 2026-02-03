/**
 * Auth Usecases - React Query hooks for authentication
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../repositories/repository_impl';
import type { LoginRequest, RegisterRequest, RefreshTokenRequest, VerifyEmailRequest } from '../model/request';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginRequest) => authRepository.login(input),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['currentUser'], response.data.user);
      }
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterRequest) => authRepository.register(input),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['currentUser'], response.data.user);
      }
    },
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (input: VerifyEmailRequest) => authRepository.verifyEmail(input),
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: (input: RefreshTokenRequest) => authRepository.refreshToken(input),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => Promise.resolve(authRepository.getCurrentUser()),
    staleTime: Infinity,
  });
}

export function getStoredUser() {
  return authRepository.getCurrentUser();
}

export function getStoredToken() {
  return authRepository.getAccessToken();
}

export function logout() {
  authRepository.logout();
}
