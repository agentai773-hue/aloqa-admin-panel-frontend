import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { adminAuthAPI, type LoginCredentials, type AdminUser } from '../../api';

interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
  loginError: {
    email?: string;
    password?: string;
    general?: string;
  } | null;
}

// Initialize state from cookies if they exist
const getInitialAuthState = (): AuthState => {
  const hasStoredAuth = adminAuthAPI.isAuthenticated();
  const storedAdmin = adminAuthAPI.getStoredAdmin();
  
  if (hasStoredAuth && storedAdmin) {
    // We have valid cookies, so start as authenticated
    return {
      user: storedAdmin,
      isLoading: false,
      isAuthenticated: true,
      isInitialized: false, // Still need to verify with server
      error: null,
      loginError: null
    };
  }
  
  // No valid cookies, start as unauthenticated
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    isInitialized: false,
    error: null,
    loginError: null
  };
};

const initialState: AuthState = getInitialAuthState();

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await adminAuthAPI.login(credentials);
      return response;
    } catch (error: unknown) {
      console.error('❌ Login failed with error:', error);
      const errorMessage = (error as Error)?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('email') || errorMessage.includes('not found')) {
        return rejectWithValue({ email: 'Email not found. Please check your email address.' });
      } else if (errorMessage.includes('password') || errorMessage.includes('incorrect')) {
        return rejectWithValue({ password: 'Password is incorrect. Please check.' });
      } else {
        return rejectWithValue({ general: (error as Error)?.message || 'Login failed. Please try again.' });
      }
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await adminAuthAPI.logout();
      return true;
    } catch (error: unknown) {
      adminAuthAPI.clearAuth();
      return rejectWithValue((error as Error)?.message || 'Logout failed');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      
 
      
      // Don't initialize if already initialized or currently loading
      if (state.auth.isInitialized || state.auth.isLoading) {
        return state.auth.user;
      }
      
      // Check if we have stored authentication data
      const hasStoredAuth = adminAuthAPI.isAuthenticated();
      const storedAdmin = adminAuthAPI.getStoredAdmin();
      
      
      // If we have both cookie and stored admin data
      if (hasStoredAuth && storedAdmin) {
        try {
          // Verify the token is still valid
          const verifyResult = await adminAuthAPI.verifyToken();
          
          if (verifyResult.valid && verifyResult.admin) {
            // Token valid, return updated admin data
            return verifyResult.admin;
          } else {
            // Token invalid, clear auth data
            console.warn('❌ Token verification failed - invalid token');
            adminAuthAPI.clearAuth();
            return null;
          }
        } catch (error) {
          // If verification fails, clear auth and return null
          console.error('❌ Token verification failed with error:', error);
          adminAuthAPI.clearAuth();
          return null;
        }
      } else {
        // No cookies or incomplete data - clear everything
        if (hasStoredAuth) {
          adminAuthAPI.clearAuth(); // Clear cookies if they exist
        }
      }
      
      return null;
    } catch (error: unknown) {
      console.error('💥 Auth initialization error:', error);
      adminAuthAPI.clearAuth();
      return rejectWithValue((error as Error)?.message || 'Auth initialization failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.loginError = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    setUser: (state, action: PayloadAction<AdminUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = false;
      state.error = null;
      state.loginError = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.loginError = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.admin;
        state.isAuthenticated = true;
        state.error = null;
        state.loginError = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.loginError = action.payload as AuthState['loginError'];
        state.error = null;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = null;
        state.loginError = null;
        
        // Clear persisted data manually
        adminAuthAPI.clearAuth();
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = action.payload as string;
        
        // Clear persisted data manually even on error
        adminAuthAPI.clearAuth();
      })
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearLoginError, setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectLoginError = (state: { auth: AuthState }) => state.auth.loginError;