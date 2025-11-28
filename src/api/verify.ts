import { apiClient, type ApiResponse } from './client';

// Types
export interface VerifyEmailData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface VerifyEmailResponse {
  message: string;
  success: boolean;
}

export interface ResendVerificationResponse {
  message: string;
  success: boolean;
}

// API functions
export const verifyAPI = {
  // Verify email with token
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>('/auth/verify-email', { token });
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from server');
    }
    return response.data.data;
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<ResendVerificationResponse> => {
    const response = await apiClient.post<ApiResponse<ResendVerificationResponse>>('/auth/resend-verification', { email });
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from server');
    }
    return response.data.data;
  },
};