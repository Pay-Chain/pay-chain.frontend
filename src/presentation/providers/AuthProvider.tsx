'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRefreshTokenMutation, logout as performLogout } from '@/data/usecase';
import { getSessionExpiry } from '@/app/actions/auth';
import { SessionTimeoutModal } from '@/presentation/components/molecules';
import { useTranslation } from '@/presentation/hooks';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

const CHECK_INTERVAL = 1000 * 60 * 1; // Check every 1 minute
const TIMEOUT_THRESHOLD = 5 * 60; // 5 minutes before expiry

export default function AuthProvider({ children }: AuthProviderProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const refreshTokenMutation = useRefreshTokenMutation();
  
  // Use a ref to track which expiration we've already warned about
  const lastWarnedExp = useRef<number | null>(null);
  const isChecking = useRef(false);

  const checkSession = useCallback(async () => {
    if (isChecking.current || isModalOpen) return;
    
    isChecking.current = true;
    try {
      const exp = await getSessionExpiry();
      if (!exp) return;

      const now = Math.floor(Date.now() / 1000);
      const timeLeft = exp - now;

      console.log(`[AuthProvider] Session check: ${Math.round(timeLeft / 60)} mins remaining`);

      if (timeLeft <= 0) {
        console.log('[AuthProvider] Session expired, logging out');
        performLogout();
        return;
      }

      // Only show modal if we haven't warned about THIS specific expiry yet
      if (timeLeft <= TIMEOUT_THRESHOLD && lastWarnedExp.current !== exp) {
        console.log('[AuthProvider] Session near expiry, showing modal');
        lastWarnedExp.current = exp;
        setIsModalOpen(true);
      }
    } finally {
      isChecking.current = false;
    }
  }, [isModalOpen]);

  useEffect(() => {
    // Initial check
    checkSession();

    // Interval check
    const interval = setInterval(checkSession, CHECK_INTERVAL);

    // Listen for session completion/expiry from HttpClient
    const handleSessionExpired = () => {
      // Prevent recursive redirects if already on login page
      if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        return;
      }

      console.log('[AuthProvider] Received session expired event');
      toast.error(t('toasts.auth.session_expired'));
      performLogout();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [checkSession]);

  const handleExtend = async () => {
    try {
      // In a real scenario, we might need the refresh token from somewhere.
      // Assuming authRepository or the mutation handles cookie-based refresh if available.
      // If the backend expects the refresh token in the body, we'd need to have stored it.
      // Most secure backends use HttpOnly refresh tokens.
      
      // The mutation expects a RefreshTokenRequest (e.g. { refreshToken: string })
      // If we're using HttpOnly cookies, we might still need to pass an empty string or dummy if the backend handles it.
      // For now, let's assume we need to pass the token if we have it, or just empty string.
      await refreshTokenMutation.mutateAsync({ refreshToken: '' });
      setIsModalOpen(false);
      lastWarnedExp.current = null;
      toast.success(t('toasts.auth.session_extended'));
      // Re-check to capture updated token/session expiry state.
      checkSession();
      
      // For now, let's assume the refresh was successful.
    } catch (error) {
      toast.error(t('toasts.auth.session_extend_failed'));
      performLogout();
    }
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    performLogout();
  };

  return (
    <>
      {children}
      <SessionTimeoutModal
        isOpen={isModalOpen}
        onClose={handleLogout}
        onExtend={handleExtend}
        isLoading={refreshTokenMutation.isPending}
      />
    </>
  );
}
