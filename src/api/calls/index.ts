import { apiClient } from '../client';
import type {
  SampleCallData,
  SampleCallResponse,
  CallHistoryFilters,
  CallHistoryResponse,
  CallDetailsResponse
} from './types';

export const callsAPI = {
  // Make a sample call
  makeSampleCall: async (data: SampleCallData): Promise<SampleCallResponse> => {
    const response = await apiClient.post('/admin/calls/sample', data);
    return response.data as SampleCallResponse;
  },

  // Get call history with filters
  getCallHistory: async (filters: CallHistoryFilters = {}): Promise<CallHistoryResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.assistantId) params.append('assistantId', filters.assistantId);
    if (filters.phoneNumber) params.append('phoneNumber', filters.phoneNumber);

    const response = await apiClient.get(`/admin/calls/history?${params.toString()}`);
    return response.data as CallHistoryResponse;
  },

  // Get call details by ID
  getCallDetails: async (callId: string): Promise<CallDetailsResponse> => {
    const response = await apiClient.get(`/admin/calls/${callId}`);
    return response.data as CallDetailsResponse;
  }
};

export * from './types';