import { TokenRepository } from "@/src/domain/repository/TokenRepository";
import { TokenListResponse, UpdateSupportedTokenRequest } from "@/src/data/model/response/token/TokenResponse";

export class UpdateTokenUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  async execute(id: string, request: UpdateSupportedTokenRequest): Promise<TokenListResponse> {
    return this.tokenRepository.update(id, request);
  }
}
