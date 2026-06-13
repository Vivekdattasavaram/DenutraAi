import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetToMain, resetToAuth } from '../navigation/NavigationService';

interface UserProfile {
  email: string;
  full_name: string;
  age?: number;
  goal?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user?: UserProfile | null;
  login: (token: string, user?: UserProfile | null) => Promise<void>;
  updateProfile: (userProfile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check for stored token and profile
    let isMounted = true;
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2000);

    const loadAuth = async () => {
      try {
        const [token, storedUser] = await AsyncStorage.multiGet(['userToken', 'userProfile']);
        const savedToken = token[1];
        const savedUser = storedUser[1];

        if (isMounted && savedToken) {
          setIsAuthenticated(true);
        }

        if (isMounted && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        if (isMounted) {
          clearTimeout(fallbackTimer);
          setLoading(false);
        }
      }
    };
    loadAuth();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  const login = async (token: string, userProfile?: UserProfile | null) => {
    setIsAuthenticated(true);
    if (userProfile) {
      setUser(userProfile);
    }

    AsyncStorage.setItem('userToken', token).catch((e) => console.error('Storage error:', e));
    if (userProfile) {
      AsyncStorage.setItem('userProfile', JSON.stringify(userProfile)).catch((e) =>
        console.error('Storage error:', e)
      );
    }
  };

  const updateProfile = async (userProfile: UserProfile) => {
    try {
      setUser(userProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to update profile', e);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    AsyncStorage.multiRemove(['userToken', 'userProfile']).catch((e) => console.error('Storage error:', e));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
