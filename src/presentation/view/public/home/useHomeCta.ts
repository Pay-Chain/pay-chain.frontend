'use client';

import { useAuthStore } from '@/presentation/hooks';

export function useHomeCta() {
  const { isAuthenticated } = useAuthStore();
  return {
    primaryHref: isAuthenticated ? '/dashboard' : '/register',
  };
}
