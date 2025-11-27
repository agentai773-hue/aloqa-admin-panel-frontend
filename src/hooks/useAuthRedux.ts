import { useAuth } from './useAuth';

/**
 * useAuthRedux Hook
 * 
 * Wrapper hook that provides the same interface as useAuth
 * but with a name that matches the AdminLogin component import.
 * 
 * This ensures consistency across the application while maintaining
 * the existing Redux Toolkit auth implementation.
 */
export function useAuthRedux() {
  return useAuth();
}