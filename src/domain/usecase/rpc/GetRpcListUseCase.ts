import { RpcRepository } from "../../repository/RpcRepository";
import { RpcFilterParams } from "../../../data/model/response/rpc/RpcResponse";
import { RpcEntity } from "../../entity/rpc/RpcEntity";
import { PaginatedResponse } from "../../../core/model/Pagination";

export class GetRpcListUseCase {
  constructor(private rpcRepository: RpcRepository) {}

  async execute(params: RpcFilterParams): Promise<PaginatedResponse<RpcEntity>> {
    return this.rpcRepository.getRpcList(params);
  }
}
