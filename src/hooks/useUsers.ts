import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, type User, type CreateUserData, type GetUsersParams } from '../api';
import toast from 'react-hot-toast';

export interface UseUsersOptions {
  enabled?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  status?: 'verified' | 'pending';
  approval?: 'approved' | 'pending';
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const queryClient = useQueryClient();
  const { 
    enabled = true, 
    page = 1, 
    limit = 10, 
    search, 
    status, 
    approval 
  } = options;

  // Fetch users with pagination and search
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', { page, limit, search, status, approval }],
    queryFn: async () => {
      const params: GetUsersParams = {
        page,
        limit,
        search,
        status,
        approval,
      };
      
      // Convert filter values to API format
      if (approval === 'approved') params.isApproval = 1;
      if (approval === 'pending') params.isApproval = 0;

      const response = await usersAPI.getUsers(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch users');
    },
    enabled, // Only fetch when enabled
    staleTime: 30000, // 30 seconds
  });

  // Extract users and pagination info
  const users = data?.users || [];
  const pagination = {
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: Math.ceil((data?.total || 0) / (data?.limit || 10))
  };

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await usersAPI.createUser({
        ...userData,
        totalMinutes: 0,
        paymentId: ''
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to create user');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateUserData> }) => {
      const response = await usersAPI.updateUser(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update user');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await usersAPI.deleteUser(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  // Toggle approval mutation
  const toggleApproval = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 0 | 1 }) => {
      const response = await usersAPI.toggleApproval(id, status);
      if (!response.success) {
        throw new Error(response.message || 'Failed to toggle approval');
      }
      return response.data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<User[]>(['users']);

      // Optimistically update to the new value
      queryClient.setQueryData<User[]>(['users'], (old) =>
        old?.map((user) =>
          user._id === id ? { ...user, isApproval: status } : user
        ) || []
      );

      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      toast.error('Failed to update status');
    },
    onSuccess: () => {
      toast.success('Status updated successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Get user by ID
  const getUserById = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return null; // Will be set dynamically
    },
    enabled: false,
  });

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    toggleApproval,
    getUserById,
  };
};
