import axios from 'axios';
import { tokenService } from './tokenService';

// API Base URL - Change this to your actual backend URL
const BASE_URL = 'http://10.19.181.248/oral_health_api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired, clear it
      tokenService.clearAll();
      // Optionally dispatch an event or redirect to login page here
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ========== AUTHENTICATION ENDPOINTS ==========

export const apiService = {
  register: async (data: any) => {
    try {
      const response = await apiClient.post('/auth/register.php', data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  login: async (data: any) => {
    try {
      const response = await apiClient.post('/auth/login.php', data);
      const loginResponse = response.data;

      // Save token and user info if login successful
      if (loginResponse.success && loginResponse.token) {
        tokenService.saveToken(loginResponse.token);
        if (loginResponse.user) {
          tokenService.saveUserInfo(
            loginResponse.user.id || 0,
            loginResponse.user.email || data.email,
            loginResponse.user.firstName || '',
            loginResponse.user.lastName || ''
          );
        }
      }

      return loginResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  forgotPassword: async (data: any) => {
    try {
      const response = await apiClient.post('/auth/forgot_password.php', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  verifyOTP: async (data: any) => {
    try {
      const response = await apiClient.post('/auth/verify_otp.php', data);
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  resetPassword: async (data: any) => {
    try {
      const response = await apiClient.post('/auth/reset_password.php', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      if (!tokenService.hasToken()) {
        return true;
      }
      
      const response = await apiClient.post('/auth/logout.php');
      tokenService.clearAll();
      return response.status === 200;
    } catch (error) {
      console.error('Logout error:', error);
      tokenService.clearAll();
      return false;
    }
  },

  // ========== HELPER METHODS ==========
  getAuthenticatedRequest: async (endpoint: string) => {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Authenticated GET request error:', error);
      throw error;
    }
  },

  postAuthenticatedRequest: async (endpoint: string, data: any) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Authenticated POST request error:', error);
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    return tokenService.hasToken();
  }
};
