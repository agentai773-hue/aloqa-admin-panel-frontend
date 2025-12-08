import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { AuthContext } from './auth-context';
import { authApi } from '../api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const storedUser = authApi.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Try to get fresh user data from API
            try {
              const response = await authApi.getProfile();
              if (response.success && response.data) {
                setUser(response.data.admin);
              }
            } catch {
              // If API call fails, clear stored auth
              authApi.clearStoredAuth();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authApi.clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.admin);
        return true;
      } else {
        const errorMessage = response.message || 'Login failed';
        setError(errorMessage);
        console.error('Login failed:', errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}