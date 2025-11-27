import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { AppDispatch } from '../store/store';
import { 
  loginAdmin, 
  logoutAdmin, 
  initializeAuth,
  clearError,
  clearLoginError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsInitialized,
  selectAuthLoading,
  selectAuthError,
  selectLoginError
} from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const loginError = useSelector(selectLoginError);

  // Initialize auth on mount if not already initialized
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized, isLoading]);

  const login = async (email: string, password: string) => {
    try {
      const result = await dispatch(loginAdmin({ email, password }));
      return loginAdmin.fulfilled.match(result);
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAdmin());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearErrors = () => {
    dispatch(clearError());
  };

  const clearLoginErrors = () => {
    dispatch(clearLoginError());
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    loginError,
    
    // Actions
    login,
    logout,
    clearErrors,
    clearLoginErrors,
    
    // Raw auth state
    auth
  };
}