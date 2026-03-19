import { TokenRepository } from "@/domain/repository/TokenRepository";
import { TokenListResponse, UpdateSupportedTokenRequest } from "@/data/model/response/token/TokenResponse";

export class UpdateTokenUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  async execute(id: string, request: UpdateSupportedTokenRequest): Promise<TokenListResponse> {
    return this.tokenRepository.update(id, request);
  }
}
