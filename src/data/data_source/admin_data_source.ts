import { httpClient } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constant';

export interface AdminStats {
  totalUsers: number;
  totalMerchants: number;
  totalVolume: string;
  activeChains: number;
}

export interface AdminMerchantUpdateInput {
  status: string;
}

export class AdminDataSource {
  private static instance: AdminDataSource;

  private constructor() {}

  public static getInstance(): AdminDataSource {
    if (!AdminDataSource.instance) {
      AdminDataSource.instance = new AdminDataSource();
    }
    return AdminDataSource.instance;
  }

  async getStats(): Promise<AdminStats> {
    const { data, error } = await httpClient.get<AdminStats>(API_ENDPOINTS.ADMIN_STATS);
    if (error) throw new Error(error);
    return data!;
  }

  async getUsers(search?: string): Promise<any[]> {
    const url = search 
      ? `${API_ENDPOINTS.ADMIN_USERS}?search=${encodeURIComponent(search)}` 
      : API_ENDPOINTS.ADMIN_USERS;
    const { data, error } = await httpClient.get<{ users: any[] }>(url);
    if (error) throw new Error(error);
    return data?.users || [];
  }

  async getMerchants(): Promise<any[]> {
    const { data, error } = await httpClient.get<{ merchants: any[] }>(API_ENDPOINTS.ADMIN_MERCHANTS);
    if (error) throw new Error(error);
    return data?.merchants || [];
  }

  async updateMerchantStatus(id: string, status: string): Promise<void> {
    const { error } = await httpClient.put(API_ENDPOINTS.ADMIN_MERCHANT_STATUS(id), { status });
    if (error) throw new Error(error);
  }

  // Chain Management
  // TODO: Verify if these endpoints are correct on backend. Assuming /v1/chains for now as per api_endpoints.ts
  async getChains(): Promise<any[]> {
    const { data, error } = await httpClient.get<{ chains: any[] }>(API_ENDPOINTS.CHAINS);
    if (error) throw new Error(error);
    return data?.chains || [];
  }

  async createChain(data: any): Promise<void> {
    const { error } = await httpClient.post(API_ENDPOINTS.ADMIN_CHAINS, data);
    if (error) throw new Error(error);
  }

  async updateChain(id: number, data: any): Promise<void> {
    const { error } = await httpClient.put(API_ENDPOINTS.ADMIN_CHAIN_BY_ID(id), data);
    if (error) throw new Error(error);
  }

  async deleteChain(id: number): Promise<void> {
    const { error } = await httpClient.delete(API_ENDPOINTS.ADMIN_CHAIN_BY_ID(id));
    if (error) throw new Error(error);
  }

  // Contract Management
  async getContracts(): Promise<any[]> {
    const { data, error } = await httpClient.get<{ contracts: any[] }>(API_ENDPOINTS.CONTRACTS);
    if (error) throw new Error(error);
    return data?.contracts || [];
  }

  async createContract(data: any): Promise<void> {
    const { error } = await httpClient.post(API_ENDPOINTS.CONTRACTS, data);
    if (error) throw new Error(error);
  }

  async updateContract(id: string, data: any): Promise<void> {
    const { error } = await httpClient.put(`${API_ENDPOINTS.CONTRACTS}/${id}`, data);
    if (error) throw new Error(error);
  }

  async deleteContract(id: string): Promise<void> {
    const { error } = await httpClient.delete(API_ENDPOINTS.CONTRACT_BY_ID(id));
    if (error) throw new Error(error);
  }
}
