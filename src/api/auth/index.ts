import { apiClient } from '../client';
import Cookies from 'js-cookie';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: Date;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  admin: AdminUser;
}

export interface VerifyTokenResponse {
  valid: boolean;
  admin?: AdminUser;
}

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: window.location.protocol === 'https:',
  sameSite: 'strict' as const,
  path: '/'
};

// Admin Auth API
export const adminAuthAPI = {
  // Admin Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/admin/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store tokens in cookies
      Cookies.set('authToken', response.data.token, COOKIE_OPTIONS);
      Cookies.set('refreshToken', response.data.refreshToken, COOKIE_OPTIONS);
      Cookies.set('adminUser', JSON.stringify(response.data.admin), COOKIE_OPTIONS);
      
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  },

  // Verify Token
  async verifyToken(): Promise<VerifyTokenResponse> {
    const token = Cookies.get('authToken');
    
    if (!token) {
      console.warn('🔍 No auth token found in cookies');
      return { valid: false };
    }

    try {
      console.log('🔍 Making verification request to /admin/auth/verify');
      const response = await apiClient.get<VerifyTokenResponse>('/admin/auth/verify');
      console.log('✅ Verification response:', response);
      return response.data || { valid: false };
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return { valid: false };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/admin/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear cookies
      Cookies.remove('authToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('adminUser', { path: '/' });
    }
  },

  // Get current admin profile
  async getProfile(): Promise<AdminUser | null> {
    try {
      const response = await apiClient.get<{ admin: AdminUser }>('/admin/auth/me');
      return response.data?.admin || null;
    } catch {
      return null;
    }
  },

  // Update admin profile
  async updateProfile(profileData: { name: string; email: string }): Promise<{ success: boolean; message: string; admin?: AdminUser }> {
    try {
      const response = await apiClient.put<{ admin: AdminUser }>('/admin/auth/profile', profileData);
      
      if (response.success && response.data?.admin) {
        // Update stored admin data
        Cookies.set('adminUser', JSON.stringify(response.data.admin), COOKIE_OPTIONS);
        
        return {
          success: true,
          message: response.message || 'Profile updated successfully',
          admin: response.data.admin
        };
      }
      
      return {
        success: false,
        message: response.message || 'Failed to update profile'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get('authToken');
  },

  // Get stored admin data
  getStoredAdmin(): AdminUser | null {
    const adminData = Cookies.get('adminUser');
    if (adminData) {
      try {
        return JSON.parse(adminData);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Clear stored auth data
  clearAuth(): void {
    Cookies.remove('authToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('adminUser', { path: '/' });
  }
};