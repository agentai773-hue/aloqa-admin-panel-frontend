import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assistantsAPI, type CreateAssistantData, type GetAssistantsParams } from '../api';
import toast from 'react-hot-toast';

export interface UseAssistantsOptions {
  enabled?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  status?: string;
  agentType?: string;
}

export const useAssistants = (options: UseAssistantsOptions = {}) => {
  const queryClient = useQueryClient();
  const { 
    enabled = true, 
    page = 1, 
    limit = 10, 
    search, 
    userId,
    status,
    agentType
  } = options;

  // Fetch assistants with pagination and search
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assistants', { page, limit, search, userId, status, agentType }],
    queryFn: async () => {
      const params: GetAssistantsParams = {
        page,
        limit,
        search,
        userId,
        status,
        agentType,
      };

      const response = await assistantsAPI.getAllAssistants(params);
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch assistants');
    },
    enabled,
    staleTime: 30000, // 30 seconds
  });

  // Extract assistants and pagination info
  const assistants = data?.assistants || [];
  const pagination = {
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: Math.ceil((data?.total || 0) / (data?.limit || 10))
  };

  // Create assistant mutation
  const createAssistant = useMutation({
    mutationFn: async (assistantData: CreateAssistantData) => {
      const response = await assistantsAPI.createAssistant(assistantData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create assistant');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast.success('Assistant created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create assistant');
    },
  });

  // Update assistant mutation
  const updateAssistant = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAssistantData> }) => {
      const response = await assistantsAPI.updateAssistant(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update assistant');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast.success('Assistant updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update assistant');
    },
  });

  // Delete assistant mutation
  const deleteAssistant = useMutation({
    mutationFn: async (id: string) => {
      const response = await assistantsAPI.deleteAssistant(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete assistant');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast.success('Assistant deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete assistant');
    },
  });

  // Get single assistant (disabled for now, will be enabled when needed)
  const getSingleAssistantQuery = useQuery({
    queryKey: ['assistant'],
    queryFn: async () => {
      return null; // Will be set dynamically
    },
    enabled: false,
  });

  return {
    assistants,
    pagination,
    isLoading,
    error,
    refetch,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    getSingleAssistant: getSingleAssistantQuery,
  };
};