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

export interface TeamMemberPayload {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  displayOrder: number;
  isActive: boolean;
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
  async getChains(page?: number, limit?: number): Promise<{ items: any[], meta?: any }> {
    const query = new URLSearchParams();
    if (page) query.append('page', page.toString());
    if (limit) query.append('limit', limit.toString());
    
    const url = query.toString() ? `${API_ENDPOINTS.CHAINS}?${query.toString()}` : API_ENDPOINTS.CHAINS;
    const { data, error } = await httpClient.get<{ items: any[], meta: any }>(url);
    if (error) throw new Error(error);
    return {
      items: data?.items || [],
      meta: data?.meta
    };
  }

  async createChain(data: any): Promise<void> {
    const { error } = await httpClient.post(API_ENDPOINTS.ADMIN_CHAINS, data);
    if (error) throw new Error(error);
  }

  async updateChain(id: string, data: any): Promise<void> {
    const { error } = await httpClient.put(API_ENDPOINTS.ADMIN_CHAIN_BY_ID(id), data);
    if (error) throw new Error(error);
  }

  async deleteChain(id: string): Promise<void> {
    const { error } = await httpClient.delete(API_ENDPOINTS.ADMIN_CHAIN_BY_ID(id));
    if (error) throw new Error(error);
  }

  // Contract Management
  async getContracts(page?: number, limit?: number, chainId?: string, type?: string): Promise<{ items: any[], meta?: any }> {
    const query = new URLSearchParams();
    if (page) query.append('page', page.toString());
    if (limit) query.append('limit', limit.toString());
    if (chainId) query.append('chainId', chainId);
    if (type) query.append('type', type);

    const url = query.toString() ? `${API_ENDPOINTS.CONTRACTS}?${query.toString()}` : API_ENDPOINTS.CONTRACTS;
    const { data, error } = await httpClient.get<{ items: any[], meta: any }>(url);
    if (error) throw new Error(error);
    return {
      items: data?.items || [],
      meta: data?.meta
    };
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

  // Team Management
  async getPublicTeams(): Promise<any[]> {
    const { data, error } = await httpClient.get<{ items: any[] }>(API_ENDPOINTS.TEAMS);
    if (error) throw new Error(error);
    return data?.items || [];
  }

  async getAdminTeams(search?: string): Promise<any[]> {
    const url = search?.trim()
      ? `${API_ENDPOINTS.ADMIN_TEAMS}?search=${encodeURIComponent(search.trim())}`
      : API_ENDPOINTS.ADMIN_TEAMS;
    const { data, error } = await httpClient.get<{ items: any[] }>(url);
    if (error) throw new Error(error);
    return data?.items || [];
  }

  async createTeam(data: TeamMemberPayload): Promise<void> {
    const { error } = await httpClient.post(API_ENDPOINTS.ADMIN_TEAMS, data);
    if (error) throw new Error(error);
  }

  async updateTeam(id: string, data: TeamMemberPayload): Promise<void> {
    const { error } = await httpClient.put(API_ENDPOINTS.ADMIN_TEAM_BY_ID(id), data);
    if (error) throw new Error(error);
  }

  async deleteTeam(id: string): Promise<void> {
    const { error } = await httpClient.delete(API_ENDPOINTS.ADMIN_TEAM_BY_ID(id));
    if (error) throw new Error(error);
  }
}
