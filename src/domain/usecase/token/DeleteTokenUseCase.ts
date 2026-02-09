import { TokenRepository } from "@/src/domain/repository/TokenRepository";

export class DeleteTokenUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  async execute(id: string): Promise<void> {
    return this.tokenRepository.delete(id);
  }
}
