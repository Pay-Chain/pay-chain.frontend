import { RpcRepository } from "@/src/domain/repository/RpcRepository";
import { RpcDataSource } from "@/src/data/datasource/rpc/RpcDataSource";
import { RpcFilterParams } from "@/src/data/model/response/rpc/RpcResponse";
import { RpcEntity } from "@/src/domain/entity/rpc/RpcEntity";
import { PaginatedResponse } from "@/src/core/model/Pagination";

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
