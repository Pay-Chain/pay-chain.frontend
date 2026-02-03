'use client';

import { useCurrentUser, getStoredUser, getStoredToken, logout as logoutUsecase } from '@/data/usecase';
import type { User } from '@/data/model/entity';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  logout: () => void;
}

export function useAuthStore(): AuthState {
  const { data: user } = useCurrentUser();
  const token = getStoredToken();
  
  return {
    isAuthenticated: !!token && !!user,
    user: user ?? null,
    token: token ?? null,
    logout: logoutUsecase,
  };
}
