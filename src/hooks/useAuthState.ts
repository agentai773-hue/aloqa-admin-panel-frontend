import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { adminAuthAPI } from '../api';
import { selectIsAuthenticated, selectIsInitialized, selectAuthLoading } from '../store/slices/authSlice';

/**
 * Custom hook that provides a unified authentication state
 * that combines Redux state with cookie validation for immediate access
 */
export function useAuthState() {
  const reduxIsAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoading = useSelector(selectAuthLoading);
  
  const [hasValidCookies, setHasValidCookies] = useState(false);

  // Check cookie validity on mount and whenever Redux state changes
  useEffect(() => {
    const checkCookies = () => {
      const hasToken = adminAuthAPI.isAuthenticated();
      const hasUser = !!adminAuthAPI.getStoredAdmin();
      setHasValidCookies(hasToken && hasUser);
    };

    checkCookies();
    
    // Also check whenever localStorage changes (tab sync)
    const handleStorageChange = () => checkCookies();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [reduxIsAuthenticated]);

  // Determine if user is authenticated (Redux OR valid cookies)
  const isAuthenticated = reduxIsAuthenticated || hasValidCookies;
  
  // User should see loading only when:
  // - Redux is loading AND we don't have valid cookies as fallback
  const shouldShowLoading = isLoading && !hasValidCookies;

  return {
    isAuthenticated,
    isLoading: shouldShowLoading,
    isInitialized,
    hasValidCookies,
    reduxIsAuthenticated
  };
}