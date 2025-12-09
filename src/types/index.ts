// Authentication related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Complete User interface for admin management
export interface AdminUser {
  _id?: string;
  name: string;
  companyName: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'super_admin';
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isApproved: boolean;
  loginAttempts: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Dashboard related types
export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  revenue: number;
}

// Common utility types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoaderData<T> {
  data: T;
  error?: string;
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}