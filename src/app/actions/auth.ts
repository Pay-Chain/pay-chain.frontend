'use server';

import { cookies } from 'next/headers';
import { ENV } from '@/core/config/env';

const BACKEND_URL = ENV.BACKEND_URL;
const INTERNAL_PROXY_SECRET = ENV.INTERNAL_PROXY_SECRET;

/**
 * Server Action to get session expiry from the current 'token' cookie.
 * This ensures we always check the most recent session state.
 */
export async function getSessionExpiry() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) return null;

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/session-expiry`, {
      method: 'GET',
      headers: {
        'X-Session-Id': sessionId,
        ...(INTERNAL_PROXY_SECRET ? { 'X-Internal-Proxy-Secret': INTERNAL_PROXY_SECRET } : {}),
      },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data?.exp ?? payload?.exp ?? null;
  } catch (error) {
    console.error('[Action] Failed to get session expiry:', error);
    return null;
  }
}
