import { RpcFilterParams } from "@/data/model/response/rpc/RpcResponse";
import { RpcEntity } from "@/domain/entity/rpc/RpcEntity";
import { PaginatedResponse } from "@/core/model/Pagination";


export interface RpcRepository {
  getRpcList(params: RpcFilterParams): Promise<PaginatedResponse<RpcEntity>>;
}
