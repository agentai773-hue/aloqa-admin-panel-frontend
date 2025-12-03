import { useQuery } from '@tanstack/react-query';
import { voiceAssignmentAPI } from '../api/voiceAssignments';
import type { VoiceAssignmentFilters } from '../api/voiceAssignments/types';

// Query keys
export const voiceAssignmentKeys = {
  all: ['voiceAssignments'] as const,
  lists: () => [...voiceAssignmentKeys.all, 'list'] as const,
  list: (filters?: VoiceAssignmentFilters) => [...voiceAssignmentKeys.lists(), filters] as const,
  byUser: (userId: string) => [...voiceAssignmentKeys.all, 'byUser', userId] as const,
  userAssignments: (userId: string, filters?: Omit<VoiceAssignmentFilters, 'userId'>) => 
    [...voiceAssignmentKeys.byUser(userId), filters] as const,
  detail: (id: string) => [...voiceAssignmentKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all voice assignments with pagination and filtering
 */
export function useVoiceAssignments(filters?: VoiceAssignmentFilters) {
  return useQuery({
    queryKey: voiceAssignmentKeys.list(filters),
    queryFn: () => voiceAssignmentAPI.getAllAssignments(filters),
    staleTime: 30000, // Cache for 30 seconds
  });
}

/**
 * Hook to fetch voice assignments for a specific user
 */
export function useUserVoiceAssignments(
  userId: string, 
  filters?: Omit<VoiceAssignmentFilters, 'userId'>,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: voiceAssignmentKeys.userAssignments(userId, filters),
    queryFn: async () => {
      console.log('🔍 Fetching voice assignments for user:', userId, 'with filters:', filters);
      const result = await voiceAssignmentAPI.getAssignmentsByUser(userId, filters);
      console.log('📊 Voice assignments result:', result);
      return result;
    },
    enabled: !!userId && (options?.enabled !== false),
    staleTime: 30000, // Cache for 30 seconds
  });
}

/**
 * Hook to fetch a single voice assignment by ID
 */
export function useVoiceAssignment(assignmentId: string) {
  return useQuery({
    queryKey: voiceAssignmentKeys.detail(assignmentId),
    queryFn: () => voiceAssignmentAPI.getAssignmentById(assignmentId),
    enabled: !!assignmentId,
  });
}