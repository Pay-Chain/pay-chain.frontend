/**
 * Auth Repository Implementation
 * Uses AuthDataSource for HTTP operations
 */
import { authDataSource } from '../../data_source';
import type { IAuthRepository } from '../repository/auth_repository';
import type { LoginRequest, RegisterRequest, VerifyEmailRequest, RefreshTokenRequest, ChangePasswordRequest } from '../../model/request';
import type { User } from '../../model/entity';


class AuthRepositoryImpl implements IAuthRepository {
  private currentUser: User | null = null;
  private accessToken: string | null = null;

  async login(input: LoginRequest) {
    const response = await authDataSource.login(input);
    if (response.data) {
      this.currentUser = response.data.user;
      // Access Token is now handled by HttpCookie and Proxy
      this.accessToken = null; 
    }
    return response;
  }

  async register(input: RegisterRequest) {
    const response = await authDataSource.register(input);
    if (response.data) {
      this.currentUser = response.data.user;
      // Access Token is now handled by HttpCookie and Proxy
      this.accessToken = null;
    }
    return response;
  }

  async verifyEmail(input: VerifyEmailRequest) {
    return authDataSource.verifyEmail(input);
  }

  async refreshToken(input: RefreshTokenRequest) {
    return authDataSource.refreshToken(input);
  }

  async changePassword(input: ChangePasswordRequest) {
    return authDataSource.changePassword(input);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAccessToken() {
    return this.accessToken;
  }

  async getMe() {
    const response = await authDataSource.getMe();
    if (response.data) {
      this.currentUser = response.data.user;
    }
    return response;
  }

  setSession(_token: string, user?: User) {
    // Token is ignored as it is handled by cookie
    if (user) {
      this.currentUser = user;
    }
  }

  async logout() {
    try {
      // Call server to clear HTTP-only cookie
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      this.currentUser = null;
      this.accessToken = null;
      if (typeof window !== 'undefined') {
        // Double check clear
        localStorage.removeItem('accessToken'); 
      }
      window.location.href = '/login'; // Hard redirect to login
    }
  }
}

export const authRepository = new AuthRepositoryImpl();
