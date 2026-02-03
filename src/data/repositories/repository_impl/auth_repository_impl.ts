/**
 * Auth Repository Implementation
 * Uses AuthDataSource for HTTP operations
 */
import { authDataSource } from '../../data_source';
import type { IAuthRepository } from '../repository/auth_repository';
import type { LoginRequest, RegisterRequest, VerifyEmailRequest, RefreshTokenRequest } from '../../model/request';
import type { User } from '../../model/entity';

class AuthRepositoryImpl implements IAuthRepository {
  private currentUser: User | null = null;
  private accessToken: string | null = null;

  async login(input: LoginRequest) {
    const response = await authDataSource.login(input);
    if (response.data) {
      this.currentUser = response.data.user;
      this.accessToken = response.data.accessToken;
    }
    return response;
  }

  async register(input: RegisterRequest) {
    const response = await authDataSource.register(input);
    if (response.data) {
      this.currentUser = response.data.user;
      this.accessToken = response.data.accessToken;
    }
    return response;
  }

  async verifyEmail(input: VerifyEmailRequest) {
    return authDataSource.verifyEmail(input);
  }

  async refreshToken(input: RefreshTokenRequest) {
    return authDataSource.refreshToken(input);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAccessToken() {
    return this.accessToken;
  }

  logout() {
    this.currentUser = null;
    this.accessToken = null;
  }
}

export const authRepository = new AuthRepositoryImpl();
