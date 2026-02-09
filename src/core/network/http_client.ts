import { ENV } from '../config/env';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // Note: Authorization header is now injected by the Next.js Proxy (route.ts)
    // using the HTTP-only cookie. Client does not handle tokens.

    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

      const makeRequest = async () => {
        return fetch(url, {
          ...options,
          headers,
          credentials: 'include',
          body: options.body ? JSON.stringify(options.body) : undefined,
        });
      };

      let response = await makeRequest();

      // Auto-Refresh Logic for 401
      if (response.status === 401) {
        // Prevent infinite loops:
        // 1. Don't refresh if the failed request was already an Auth request (login, refresh, me, logout)
        const isAuthRequest = url.includes('/auth/');
        
        // 2. Don't refresh if we are already on the login page (client-side check)
        const isLoginPage = typeof window !== 'undefined' && 
          (window.location.pathname === '/login' || window.location.pathname === '/register');

        if (isAuthRequest || isLoginPage) {
             // Just return the error, let the UI/Auth Provider handle it (or do nothing)
             return { error: 'Unauthorized' };
        }

        try {
          // Attempt to refresh token
          const refreshResponse = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
          });

          if (refreshResponse.ok) {
            // Retry original request
            response = await makeRequest();
          } else {
            // Refresh failed, session is truly expired
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('auth:session-expired'));
            }
          }
        } catch (error) {
           console.error('Failed to refresh token:', error);
           if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('auth:session-expired'));
            }
        }
      }

      const responseText = await response.text();
      let data: any;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        if (!response.ok) {
          return { error: responseText || `Request failed with status ${response.status}` };
        }
        console.error('Failed to parse successful response as JSON:', parseError);
        return { error: 'Malformed response from server' };
      }

      if (!response.ok) {
        return { error: data.error || data.message || `Request failed with status ${response.status}` };
      }

      return { data };
    } catch (error) {
      console.error('HTTP Client Error:', error);
      return { error: 'Network error' };
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Singleton instance
export const httpClient = new HttpClient(ENV.API_BASE_URL);
