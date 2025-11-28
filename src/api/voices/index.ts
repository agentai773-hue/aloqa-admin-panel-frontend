import { apiClient } from '../client';

export interface Voice {
  id: string;
  voice_id: string;
  provider: string;
  name: string;
  model: string;
  accent: string;
}

export interface VoiceProvider {
  value: string;
  label: string;
  color: string;
}

export interface VoiceAccent {
  value: string;
  label: string;
  color: string;
}

export interface VoiceSearchParams {
  provider?: string;
  search?: string;
  accent?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface VoicesResponse {
  voices: Voice[];
  total: number;
  filters: VoiceSearchParams;
}

export interface VoiceAssignment {
  _id: string;
  voiceId: string;
  voiceName: string;
  provider: string;
  model: string;
  accent: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
  };
  status: 'active' | 'inactive';
  assignedAt: string;
  updatedAt: string;
}

export interface AssignVoiceRequest {
  voiceId: string;
  userId: string;
}

export const voicesAPI = {
  getVoices: async (params: VoiceSearchParams = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.provider) queryParams.append('provider', params.provider);
    if (params.search) queryParams.append('search', params.search);
    if (params.accent) queryParams.append('accent', params.accent);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const endpoint = queryParams.toString() ? `/admin/voices?${queryParams.toString()}` : '/admin/voices';
    return apiClient.get<VoicesResponse>(endpoint);
  },

  getVoiceById: async (voiceId: string) => {
    return apiClient.get<Voice>(`/admin/voices/${voiceId}`);
  },

  getVoiceProviders: async () => {
    return apiClient.get<VoiceProvider[]>('/admin/voices/providers');
  },

  getVoiceAccents: async () => {
    return apiClient.get<VoiceAccent[]>('/admin/voices/accents');
  },

  assignVoice: async (data: AssignVoiceRequest) => {
    return apiClient.post<VoiceAssignment>('/admin/voices/assign', data);
  },

  getAssignedVoices: async (userId?: string) => {
    const endpoint = userId ? `/admin/voices/assignments?userId=${userId}` : '/admin/voices/assignments';
    return apiClient.get<VoiceAssignment[]>(endpoint);
  },

  unassignVoice: async (assignmentId: string) => {
    return apiClient.delete<VoiceAssignment>(`/admin/voices/assignments/${assignmentId}`);
  }
};
