'use client';

import { useCurrentUser, logout as logoutUsecase } from '@/data/usecase';
import type { User } from '@/data/model/entity';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

export function useAuthStore(): AuthState {
  const { data: user, isLoading } = useCurrentUser();
  // Token is now HttpOnly cookie, so client doesn't see it.
  const token = null; 
  
  return {
    isAuthenticated: !!user,
    user: user ?? null,
    token: null,
    isLoading,
    logout: logoutUsecase,
  };
}
