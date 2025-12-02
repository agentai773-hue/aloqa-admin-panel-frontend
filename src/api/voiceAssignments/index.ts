import { apiClient } from '../client';
import type {
  CreateVoiceAssignmentData,
  UpdateVoiceAssignmentData,
  VoiceAssignmentListResponse,
  VoiceAssignmentResponse,
  VoiceAssignmentFilters
} from './types';

export const voiceAssignmentAPI = {
  // Assign voice to user
  assignVoiceToUser: async (data: CreateVoiceAssignmentData): Promise<VoiceAssignmentResponse> => {
    const response = await apiClient.post('/assign-user-voice', data as Record<string, unknown>);
    return response.data as VoiceAssignmentResponse;
  },

  // Get all voice assignments with filters
  getAllAssignments: async (filters: VoiceAssignmentFilters = {}): Promise<VoiceAssignmentListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get(`/assign-user-voice?${params.toString()}`);
    return response.data as VoiceAssignmentListResponse;
  },

  // Get assignments by user ID
  getAssignmentsByUser: async (userId: string, filters: Omit<VoiceAssignmentFilters, 'userId'> = {}): Promise<VoiceAssignmentListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get(`/assign-user-voice/user/${userId}?${params.toString()}`);
    return response.data as VoiceAssignmentListResponse;
  },

  // Get single assignment by ID
  getAssignmentById: async (assignmentId: string): Promise<VoiceAssignmentResponse> => {
    const response = await apiClient.get(`/assign-user-voice/${assignmentId}`);
    return response.data as VoiceAssignmentResponse;
  },

  // Update assignment
  updateAssignment: async (assignmentId: string, data: UpdateVoiceAssignmentData): Promise<VoiceAssignmentResponse> => {
    const response = await apiClient.put(`/assign-user-voice/${assignmentId}`, data as Record<string, unknown>);
    return response.data as VoiceAssignmentResponse;
  },

  // Update assignment status
  updateAssignmentStatus: async (assignmentId: string, status: 'active' | 'inactive'): Promise<VoiceAssignmentResponse> => {
    const response = await apiClient.patch(`/assign-user-voice/${assignmentId}/status`, { status });
    return response.data as VoiceAssignmentResponse;
  },

  // Delete assignment (soft delete)
  deleteAssignment: async (assignmentId: string): Promise<VoiceAssignmentResponse> => {
    const response = await apiClient.delete(`/assign-user-voice/${assignmentId}`);
    return response.data as VoiceAssignmentResponse;
  }
};

export * from './types';