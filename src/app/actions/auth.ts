'use server';

import { decryptToken } from '@/core/security/token';
import { validateSession } from '@/core/auth/auth_guard';

import { cookies } from 'next/headers';

/**
 * Server Action to get session expiry from the current 'token' cookie.
 * This ensures we always check the most recent session state.
 */
export async function getSessionExpiry() {
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get('token')?.value;

  if (!encryptedToken) return null;

  try {
    // 1. Decrypt the outer JWE token
    const token = await decryptToken(encryptedToken);
    if (!token) return null;

    // 2. Validate/Decode the inner JWT
    const session = await validateSession(token);
    if (!session || !session.exp) return null;

    // Return expiration timestamp in seconds
    return session.exp;
  } catch (error) {
    console.error('[Action] Failed to get session expiry:', error);
    return null;
  }
}
