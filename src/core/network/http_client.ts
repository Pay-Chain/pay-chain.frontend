import { ENV } from '../config/env';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

class HttpClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

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
