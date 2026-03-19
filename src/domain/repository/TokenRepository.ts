import { TokenFilterParams } from "@/data/model/response/token/TokenResponse";
import { SupportedTokenEntity } from "@/domain/entity/token/TokenEntity";
import { PaginatedResponse } from "@/core/model/Pagination";


export interface TokenRepository {
  getTokens(params: TokenFilterParams): Promise<PaginatedResponse<SupportedTokenEntity>>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}
