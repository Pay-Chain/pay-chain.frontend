import { TokenFilterParams } from "@/src/data/model/response/token/TokenResponse";
import { SupportedTokenEntity } from "@/src/domain/entity/token/TokenEntity";
import { PaginatedResponse } from "@/src/core/model/Pagination";


export interface TokenRepository {
  getTokens(params: TokenFilterParams): Promise<PaginatedResponse<SupportedTokenEntity>>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}
