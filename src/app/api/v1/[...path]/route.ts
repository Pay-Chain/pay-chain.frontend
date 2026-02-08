import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptToken, decryptToken } from '@/core/security/token';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

/**
 * Proxy API Route Handler
 * Forwards all /api/v1/* requests to the backend server
 * Handles encryption/decryption of auth tokens in cookies
 */
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  const targetPath = `/api/v1/${path.join('/')}`;
  const targetUrl = `${BACKEND_URL}${targetPath}`;

  // Get search params
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

  // 1. Decrypt Cookies & Inject Headers/Cookies
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get('token')?.value;
  const encryptedRefreshToken = cookieStore.get('refresh_token')?.value;
  
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Forward headers except host and cookie (we handle auth manually)
    if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'cookie') {
      headers.set(key, value);
    }
  });

  // Inject Authorization Header
  if (encryptedToken) {
    const rawToken = await decryptToken(encryptedToken);
    if (rawToken) {
      headers.set('Authorization', `Bearer ${rawToken}`);
      console.log(`[Proxy] Injected Auth Header for ${targetPath}`);
    }
  }

  // Inject Refresh Token Cookie for Backend
  if (encryptedRefreshToken) {
    const rawRefreshToken = await decryptToken(encryptedRefreshToken);
    if (rawRefreshToken) {
      // Backend expects the refresh token in a cookie named 'refresh_token'
      headers.set('Cookie', `refresh_token=${rawRefreshToken}`);
      console.log(`[Proxy] Injected Refresh Token Cookie for ${targetPath}`);
    }
  }

  try {
    // Get request body for non-GET requests
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    // Forward the request to backend
    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      body,
    });

    console.log(`[Proxy] ${request.method} ${targetPath} -> ${response.status} ${response.statusText}`);

    // Get response data
    const contentType = response.headers.get('content-type');
    let data: any;
    let rawData: string | ArrayBuffer;

    if (contentType?.includes('application/json')) {
      const text = await response.text();
      rawData = text;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = {};
      }
    } else {
      rawData = await response.arrayBuffer();
    }

    // Intercept Auth/Refresh endpoints to manage cookies
    const isLoginRegister = (path.includes('login') || path.includes('register')) && path.includes('auth');
    const isRefresh = path.includes('refresh') && path.includes('auth');
    
    if ((isLoginRegister || isRefresh) && response.ok && data) {
      const resultData = data.data || data;
      const accessToken = resultData.accessToken;
      const refreshToken = resultData.refreshToken;

      if (accessToken || refreshToken) {
        // Prepare response without raw tokens
        const { accessToken: _, refreshToken: __, ...rest } = resultData;
        const responseBody = data.data ? { ...data, data: rest } : rest;

        const nextResp = NextResponse.json(responseBody, { status: 200 });

        // Set Access Token Cookie
        if (accessToken) {
          const encryptedAT = await encryptToken(accessToken);
          nextResp.cookies.set('token', encryptedAT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24h
          });
        }

        // Set Refresh Token Cookie
        if (refreshToken) {
          const encryptedRT = await encryptToken(refreshToken);
          nextResp.cookies.set('refresh_token', encryptedRT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          });
        }

        return nextResp;
      }
    }

    // Standard Response Handling
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip hop-by-hop headers
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(rawData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy] Error forwarding request:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend server' },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
