import { RpcRepository } from "@/domain/repository/RpcRepository";
import { RpcDataSource } from "@/data/datasource/rpc/RpcDataSource";
import { RpcFilterParams } from "@/data/model/response/rpc/RpcResponse";
import { RpcEntity } from "@/domain/entity/rpc/RpcEntity";
import { PaginatedResponse } from "@/core/model/Pagination";

export class RpcRepositoryImpl implements RpcRepository {
  constructor(private dataSource: RpcDataSource) {}

  async getRpcList(params: RpcFilterParams): Promise<PaginatedResponse<RpcEntity>> {
    const response = await this.dataSource.getRpcList(params);
    const items = (response.items || response.rpcs || []).map(rpc => ({
      id: rpc.id,
      chainId: rpc.chainId,
      url: rpc.url,
      priority: rpc.priority,
      isActive: rpc.isActive,
      lastErrorAt: rpc.lastErrorAt,
      errorCount: rpc.errorCount,
      createdAt: rpc.createdAt,
      updatedAt: rpc.updatedAt,
      chain: rpc.chain,
    }));

    return {
      items,
      meta: response.meta!
    };
  }
}
