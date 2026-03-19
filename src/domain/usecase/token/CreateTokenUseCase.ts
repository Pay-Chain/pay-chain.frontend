import { TokenRepository } from "@/domain/repository/TokenRepository";
import { CreateSupportedTokenRequest, TokenListResponse } from "@/data/model/response/token/TokenResponse";

export class CreateTokenUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  async execute(request: CreateSupportedTokenRequest): Promise<TokenListResponse> {
    return this.tokenRepository.create(request);
  }
}
