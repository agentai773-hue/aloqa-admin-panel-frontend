// Optimized API client and configuration
import axios from 'axios';
import Cookies from 'js-cookie';

// Get API URL with fallback and validation
const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const fallbackUrl = 'http://localhost:8080/api';
  
  // If no environment URL, use fallback
  if (!envUrl) {
    console.warn('⚠️ VITE_API_URL not set, using fallback:', fallbackUrl);
    return fallbackUrl;
  }
  
  // Validate URL format
  if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
    console.error('❌ Invalid VITE_API_URL format:', envUrl);
    return fallbackUrl;
  }
  
  return envUrl;
};

const API_BASE_URL = getApiUrl();

// Enhanced logging for debugging production issues
console.log('🔧 Admin Panel API Configuration:', {
  'Environment': import.meta.env.MODE || 'unknown',
  'VITE_API_URL (raw)': import.meta.env.VITE_API_URL,
  'API_BASE_URL (final)': API_BASE_URL,
  'Is Production': import.meta.env.PROD,
  'Is Development': import.meta.env.DEV
});

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed:', error);
    
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      // Clear auth cookies
      Cookies.remove('authToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('adminUser', { path: '/' });
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    throw error;
  }
);

// API client object with methods
export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(endpoint, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      }
      throw error;
    }
  },

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      }
      throw error;
    }
  },

  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      }
      throw error;
    }
  },

  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      }
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      }
      throw error;
    }
  }
};

export { axiosInstance as axios };
export default apiClient;
