// User API functions
import { apiClient } from './client';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  companyName: string;
  companyAddress: string;
  userId: string;
  bearerToken?: string;
  isApproval: 0 | 1;
  totalMinutes: number;
  paymentId?: string;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  companyName: string;
  companyAddress: string;
  password: string;
  confirmPassword: string;
  bearerToken?: string;
  totalMinutes?: number;
  paymentId?: string;
  [key: string]: string | number | undefined;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  isApproval?: 0 | 1;
  totalMinutes?: number;
  bearerToken?: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserStatsResponse {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
}

export const usersAPI = {
  // Get all users
  async getUsers(params?: { page?: number; limit?: number; isApproval?: 0 | 1 }) {
    let endpoint = '/users';
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.isApproval !== undefined) queryParams.append('isApproval', params.isApproval.toString());
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    return apiClient.get<UsersListResponse>(endpoint);
  },

  // Get user by ID
  async getUserById(id: string) {
    return apiClient.get<{ user: User }>(`/users/${id}`);
  },

  // Create new user
  async createUser(userData: CreateUserData) {
    return apiClient.post<{ user: User }>('/users', userData);
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserData) {
    return apiClient.put<{ user: User }>(`/users/${id}`, userData);
  },

  // Toggle user approval
  async toggleApproval(id: string, isApproval: 0 | 1) {
    return apiClient.patch<{ user: User }>(`/users/${id}/approval`, { isApproval });
  },

  // Delete user
  async deleteUser(id: string) {
    return apiClient.delete<void>(`/users/${id}`);
  },

  // Get user statistics
  async getUserStats() {
    return apiClient.get<UserStatsResponse>('/users/stats');
  }
};
