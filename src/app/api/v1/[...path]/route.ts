import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

/**
 * Proxy API Route Handler
 * Forwards all /api/v1/* requests to the backend server
 */
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  const targetPath = `/v1/${path.join('/')}`;
  const targetUrl = `${BACKEND_URL}${targetPath}`;

  // Get search params
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

  // Forward headers (except host)
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value);
    }
  });

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
    let data: string | ArrayBuffer;

    if (contentType?.includes('application/json')) {
      data = await response.text();
    } else {
      data = await response.arrayBuffer();
      console.log(`[Proxy] Non-JSON response received: ${contentType}`);
    }

    if (!response.ok) {
       console.error(`[Proxy] Backend returned error status ${response.status}: ${data instanceof ArrayBuffer ? 'Binary data' : data}`);
    }

    // Create response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip hop-by-hop headers
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(data, {
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
