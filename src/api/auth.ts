import { apiClient } from './client';

export interface LoginCredentials extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin?: Date;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const authApi = {
  // Login admin
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store tokens in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.data.admin));
    }
    
    return response;
  },

  // Refresh access token
  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken
    });
    
    if (response.success && response.data) {
      // Update tokens in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response;
  },

  // Get current admin profile
  async getProfile() {
    return await apiClient.get<{ admin: AuthResponse['admin'] }>('/auth/me');
  },

  // Logout admin
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get stored user data
  getStoredUser(): AuthResponse['admin'] | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Clear stored auth data
  clearStoredAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }
};