// Email Verification API functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance for verification endpoints (no auth required)
const verifyAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      isActive: 0 | 1;
      isApproval: 0 | 1;
    };
  };
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export const verifyAPI = {
  // Verify email with token
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await verifyAxios.get<VerifyEmailResponse>(`/verify-email/${token}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'An error occurred during verification. Please try again later.',
      };
    }
  },

  // Resend verification email
  async resendVerification(email: string): Promise<ResendVerificationResponse> {
    try {
      const response = await verifyAxios.post<ResendVerificationResponse>('/verify-email/resend', {
        email,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'An error occurred. Please try again later.',
      };
    }
  },
};
