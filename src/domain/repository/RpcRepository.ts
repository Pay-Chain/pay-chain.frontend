import { RpcFilterParams } from "@/src/data/model/response/rpc/RpcResponse";
import { RpcEntity } from "@/src/domain/entity/rpc/RpcEntity";
import { PaginatedResponse } from "@/src/core/model/Pagination";


export interface RpcRepository {
  getRpcList(params: RpcFilterParams): Promise<PaginatedResponse<RpcEntity>>;
}
