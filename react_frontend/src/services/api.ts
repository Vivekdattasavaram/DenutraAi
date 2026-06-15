import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Use localhost for web to avoid CORS/mixed-content issues, and local IP for physical devices
const BASE_URL = Platform.OS === 'web' ? 'http://127.0.0.1:8000' : 'http://10.42.223.248:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for request', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('[Axios Error] URL:', error.config?.url);
    console.error('[Axios Error] Status:', error.response?.status);
    console.error('[Axios Error] Full Object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));

    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear token, force logout)
      await AsyncStorage.removeItem('userToken');
      // A full implementation would trigger a context event here
    }
    return Promise.reject(error);
  }
);
