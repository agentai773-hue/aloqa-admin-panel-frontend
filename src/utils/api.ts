// API utility functions
import axios from 'axios';

export const apiClient = {
  baseURL: '/api',
  
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(`API Error: ${error.response?.statusText || error.message}`);
    }
  },
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await axios.post<T>(`${this.baseURL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(`API Error: ${error.response?.statusText || error.message}`);
    }
  },
};

// Local storage utilities
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};
