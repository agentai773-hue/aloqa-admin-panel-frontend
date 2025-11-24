import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, type User, type CreateUserData } from '../api';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await usersAPI.getUsers();
      if (response.success && response.data) {
        return response.data.users;
      }
      throw new Error('Failed to fetch users');
    },
    staleTime: 30000, // 30 seconds
  });

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
    users: data || [],
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
