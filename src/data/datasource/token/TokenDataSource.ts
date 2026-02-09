import { HttpClient } from "@/core/network/http_client";
import { API_ENDPOINTS } from "@/core/constant/api_endpoints";
import { TokenListResponse, TokenFilterParams } from "../../model/response/token/TokenResponse";

export interface TokenDataSource {
  getTokens(params: TokenFilterParams): Promise<TokenListResponse>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}

export class TokenDataSourceImpl implements TokenDataSource {
  constructor(private client: HttpClient) {}

  async getTokens(params: TokenFilterParams): Promise<TokenListResponse> {
    const query = new URLSearchParams();
    if (params.chainId) query.append('chainId', params.chainId.toString());
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await this.client.get<TokenListResponse>(`${API_ENDPOINTS.ADMIN_TOKENS}?${query.toString()}`);
    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to fetch tokens');
    }
    return response.data;
  }

  async create(data: any): Promise<any> {
    const response = await this.client.post<any>(API_ENDPOINTS.ADMIN_TOKENS, data);
    return response.data;
  }

  async update(id: string, data: any): Promise<any> {
    const response = await this.client.put<any>(`${API_ENDPOINTS.ADMIN_TOKENS}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`${API_ENDPOINTS.ADMIN_TOKENS}/${id}`);
  }
}
