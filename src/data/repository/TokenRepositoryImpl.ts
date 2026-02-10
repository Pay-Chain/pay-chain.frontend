import { TokenRepository } from "@/src/domain/repository/TokenRepository";
import { TokenDataSource } from "@/src/data/datasource/token/TokenDataSource";
import { TokenFilterParams } from "@/src/data/model/response/token/TokenResponse";
import { SupportedTokenEntity } from "@/src/domain/entity/token/TokenEntity";
import { PaginatedResponse } from "@/src/core/model/Pagination";

export class TokenRepositoryImpl implements TokenRepository {
  constructor(private dataSource: TokenDataSource) {}

  async getTokens(params: TokenFilterParams): Promise<PaginatedResponse<SupportedTokenEntity>> {
    const response = await this.dataSource.getTokens(params);
    const items = (response.items || response.tokens || []).map(t => ({
      id: t.id,
      chainId: t.chainId,
      name: t.name,
      symbol: t.symbol,
      decimals: t.decimals,
      logoUrl: t.logoUrl,
      type: t.type,
      contractAddress: t.contractAddress,
      isActive: t.isActive,
      isNative: t.isNative,
      isStablecoin: t.isStablecoin,
      minAmount: t.minAmount,
      maxAmount: t.maxAmount,
      createdAt: t.createdAt,
      chain: t.chain,
    }));

    return {
      items,
      meta: response.meta!
    };
  }

  async create(data: any): Promise<any> {
    return this.dataSource.create(data);
  }

  async update(id: string, data: any): Promise<any> {
    return this.dataSource.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}
