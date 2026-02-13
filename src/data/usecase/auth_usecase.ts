/**
 * Auth Usecases - React Query hooks for authentication
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../repositories/repository_impl';
import type { LoginRequest, RegisterRequest, RefreshTokenRequest, VerifyEmailRequest, ChangePasswordRequest } from '../model/request';

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

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (input: ChangePasswordRequest) => authRepository.changePassword(input),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // 1. Check if we already have the user in memory
      const cachedUser = authRepository.getCurrentUser();
      if (cachedUser) return cachedUser;

      // 2. If not, try to fetch from server (it uses HttpOnly cookie)
      try {
        const response = await authRepository.getMe();
        return response.data?.user ?? null;
      } catch (error) {
        // If 401 or network error, just return null (guest mode)
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
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
