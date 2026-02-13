import { AdminDataSource, AdminStats, TeamMemberPayload } from '../data_source/admin_data_source';

export class AdminRepository {
  private dataSource: AdminDataSource;

  constructor() {
    this.dataSource = AdminDataSource.getInstance();
  }

  async getStats(): Promise<AdminStats> {
    return this.dataSource.getStats();
  }

  async getUsers(search?: string): Promise<any[]> {
    return this.dataSource.getUsers(search);
  }

  async getMerchants(): Promise<any[]> {
    return this.dataSource.getMerchants();
  }

  async updateMerchantStatus(id: string, status: string): Promise<void> {
    return this.dataSource.updateMerchantStatus(id, status);
  }

  async getChains(page?: number, limit?: number): Promise<{ items: any[], meta?: any }> {
    return this.dataSource.getChains(page, limit);
  }

  async createChain(data: any): Promise<void> {
    return this.dataSource.createChain(data);
  }

  async updateChain(id: string, data: any): Promise<void> {
    return this.dataSource.updateChain(id, data);
  }

  async deleteChain(id: string): Promise<void> {
    return this.dataSource.deleteChain(id);
  }

  async getContracts(page?: number, limit?: number, chainId?: string, type?: string): Promise<{ items: any[], meta?: any }> {
    return this.dataSource.getContracts(page, limit, chainId, type);
  }

  async createContract(data: any): Promise<void> {
    return this.dataSource.createContract(data);
  }

  async updateContract(id: string, data: any): Promise<void> {
    return this.dataSource.updateContract(id, data);
  }

  async deleteContract(id: string): Promise<void> {
    return this.dataSource.deleteContract(id);
  }

  async getPublicTeams(): Promise<any[]> {
    return this.dataSource.getPublicTeams();
  }

  async getAdminTeams(search?: string): Promise<any[]> {
    return this.dataSource.getAdminTeams(search);
  }

  async createTeam(data: TeamMemberPayload): Promise<void> {
    return this.dataSource.createTeam(data);
  }

  async updateTeam(id: string, data: TeamMemberPayload): Promise<void> {
    return this.dataSource.updateTeam(id, data);
  }

  async deleteTeam(id: string): Promise<void> {
    return this.dataSource.deleteTeam(id);
  }
}
