/**
 * Auth Data Source
 * Acts as HTTP connector between AuthRepository and httpClient
 */
import { httpClient } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constants';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
} from '../model/request';
import type {
  AuthResponse,
  RefreshTokenResponse,
  MessageResponse,
} from '../model/response';

class AuthDataSource {
  async login(request: LoginRequest) {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, request);
  }

  async register(request: RegisterRequest) {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, request);
  }

  async verifyEmail(request: VerifyEmailRequest) {
    return httpClient.post<MessageResponse>(API_ENDPOINTS.AUTH_VERIFY_EMAIL, request);
  }

  async refreshToken(request: RefreshTokenRequest) {
    return httpClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH_REFRESH, request);
  }

  async getMe() {
    return httpClient.get<AuthResponse>(API_ENDPOINTS.AUTH_ME);
  }

  async changePassword(request: ChangePasswordRequest) {
    return httpClient.post<MessageResponse>(API_ENDPOINTS.AUTH_CHANGE_PASSWORD, request);
  }
}

export const authDataSource = new AuthDataSource();
