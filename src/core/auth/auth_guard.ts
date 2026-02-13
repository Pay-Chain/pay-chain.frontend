import { jwtVerify } from 'jose';
import { UserRole } from '@/core/constants/roles';
import { ENV } from '@/core/config/env';

const SECRET_KEY = ENV.JWT_SECRET;
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload {
  sub: string;
  role: string;
  exp: number;
}

export async function validateSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);

    console.log(`Session payload: ${JSON.stringify(payload)}`);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error(`Session validation error: ${error}`);
    return null;
  }
}

export function isAuthorized(role: string, requiredRole: UserRole): boolean {
  if (role === UserRole.ADMIN) return true; // Admin accesses everything
  if (role === requiredRole) return true;
  return false;
}
