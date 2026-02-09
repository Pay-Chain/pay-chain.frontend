import { TokenRepository } from "../../repository/TokenRepository";
import { TokenFilterParams } from "../../../data/model/response/token/TokenResponse";
import { SupportedTokenEntity } from "../../entity/token/TokenEntity";
import { PaginatedResponse } from "../../../core/model/Pagination";

export class GetTokenListUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  async execute(params: TokenFilterParams): Promise<PaginatedResponse<SupportedTokenEntity>> {
    return this.tokenRepository.getTokens(params);
  }
}
