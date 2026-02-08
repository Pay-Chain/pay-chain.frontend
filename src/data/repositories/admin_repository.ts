import { AdminDataSource, AdminStats } from '../data_source/admin_data_source';

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

  async getChains(): Promise<any[]> {
    return this.dataSource.getChains();
  }

  async createChain(data: any): Promise<void> {
    return this.dataSource.createChain(data);
  }

  async updateChain(id: number, data: any): Promise<void> {
    return this.dataSource.updateChain(id, data);
  }

  async deleteChain(id: number): Promise<void> {
    return this.dataSource.deleteChain(id);
  }

  async getContracts(): Promise<any[]> {
    return this.dataSource.getContracts();
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
}
