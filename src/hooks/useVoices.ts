import { useQuery } from '@tanstack/react-query';
import { voiceApi } from '../api/voices';

// Query keys
export const voiceKeys = {
  all: ['voices'] as const,
  lists: () => [...voiceKeys.all, 'list'] as const,
  list: (provider?: string) => [...voiceKeys.lists(), { provider }] as const,
  details: () => [...voiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...voiceKeys.details(), id] as const,
};

// Custom hooks
export function useVoices() {
  // Always load ALL voices once, no provider filtering on backend
  return useQuery({
    queryKey: voiceKeys.lists(), // Remove provider from query key since we're loading all
    queryFn: () => voiceApi.getAll(), // Always get all voices
    enabled: true,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

export function useVoice(id: string) {
  return useQuery({
    queryKey: voiceKeys.detail(id),
    queryFn: () => voiceApi.getById(id),
    enabled: !!id,
  });
}