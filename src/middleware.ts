import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/core/auth/auth_guard';
import { UserRole } from '@/core/constants/roles';
import { decryptToken } from '@/core/security/token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const encryptedToken = request.cookies.get('token')?.value;

  // 1. Check for token existence
  if (!encryptedToken) {
    const loginUrl = new URL('/login', request.url);
    // Add return URL if needed
    return NextResponse.redirect(loginUrl);
  }

  // 1.5 Decrypt Token
  const token = await decryptToken(encryptedToken);

  if (!token) {
     const loginUrl = new URL('/login', request.url);
     return NextResponse.redirect(loginUrl);
  }

  // 2. Validate session
  const session = await validateSession(token);

  // 3. Role-based Access Control
  if (pathname.startsWith('/admin')) {
    console.log(`[Middleware] Checking admin access for ${session?.role}`);
    if (!session || session.role !== UserRole.ADMIN) {
      console.log(`[Middleware] Access denied. Session role: ${session?.role}, Required: ${UserRole.ADMIN}`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    console.log('[Middleware] Admin access granted');
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/pay/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/wallets/:path*',
    '/payments/:path*',
    '/payment-requests/:path*',
    '/merchant/:path*',
  ],
};
