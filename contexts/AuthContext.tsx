import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authService } from '../services/auth';
import { storage } from '../services/storage';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'student' | 'parent';
  studentId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
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

  // Protect routes based on authentication
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';
    const inStudentGroup = segments[0] === '(student)';

    if (!user && !inAuthGroup) {
      // Redirect to welcome if not authenticated
      router.replace('/(auth)/welcome');
    } else if (user) {
      // Redirect based on role
      if (user.role === 'admin' && !inAdminGroup) {
        router.replace('/(admin)/dashboard');
      } else if (user.role === 'student' && !inStudentGroup) {
        router.replace('/(student)/home');
      }
    }
  }, [user, segments, isLoading]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await storage.getToken();
      const userData = await storage.getUser();

      if (token && userData) {
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
      setUser(response.user);
      
      // Navigate based on role
      if (response.user.role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(student)/home');
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data: any) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      
      // New users are students by default
      router.replace('/(student)/home');
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
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
