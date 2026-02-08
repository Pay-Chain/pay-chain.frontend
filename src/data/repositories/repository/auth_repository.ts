/**
 * Auth Repository Interface
 */
import type { ApiResponse } from '@/core/network';
import type { LoginRequest, RegisterRequest, VerifyEmailRequest, RefreshTokenRequest } from '../../model/request';
import type { AuthResponse, RefreshTokenResponse, MessageResponse } from '../../model/response';
import type { User } from '../../model/entity';

export interface IAuthRepository {
  login(input: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  register(input: RegisterRequest): Promise<ApiResponse<AuthResponse>>;
  verifyEmail(input: VerifyEmailRequest): Promise<ApiResponse<MessageResponse>>;
  refreshToken(input: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>>;
  getCurrentUser(): User | null;
  getAccessToken(): string | null;
  setSession(token: string, user?: User): void;
  logout(): void;
}
