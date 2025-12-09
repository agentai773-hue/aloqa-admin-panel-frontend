import { apiClient } from '../client';
import type { Voice, VoiceResponse, VoiceDetailResponse } from './types';

export const voiceApi = {
  /**
   * Get all voices
   */
  getAll: async (provider?: string): Promise<Voice[]> => {
    try {
      const params = provider ? { provider } : {};
      const response = await apiClient.get<VoiceResponse>('/admin/voices', { params });
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      throw new Error('Invalid response format - expected voice array');
    } catch (error) {
      console.error('🔊 API call failed:', error);
      throw error;
    }
  },

  /**
   * Get voice by ID
   */
  getById: async (voiceId: string): Promise<Voice> => {
    try {
      const response = await apiClient.get<VoiceDetailResponse>(`/admin/voices/${voiceId}`);
      if (response.data?.data) {
        return response.data.data;
      }
      throw new Error('Voice not found');
    } catch (error) {
      console.error('🔊 API call failed for voice ID:', voiceId, error);
      throw error;
    }
  },

  /**
   * Get voices by provider
   */
  getByProvider: async (provider: string): Promise<Voice[]> => {
    return voiceApi.getAll(provider);
  }
};

// Re-export types
export type { Voice, VoiceResponse, VoiceDetailResponse } from './types';