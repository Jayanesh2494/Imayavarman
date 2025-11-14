import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authService } from '../services/auth';
import { storage } from '../services/storage';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (user && user.role === 'admin' && !inAdminGroup) {
      router.replace('/(admin)/dashboard');
    }
  }, [user, segments, isLoading]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await storage.getToken();
      const userData = await storage.getUser();

      if (token && userData && userData.role === 'admin') {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      
      // Only allow admin login
      if (response.user.role !== 'admin') {
        throw new Error('Only administrators can access this application');
      }
      
      setUser(response.user);
      router.replace('/(admin)/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
