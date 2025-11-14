import api from './api';
import { storage } from './storage';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<any, AuthResponse>('/auth/login', credentials);
      
      // Save token and user data
      await storage.saveToken(response.token);
      await storage.saveUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<any, AuthResponse>('/auth/register', data);
      
      // Save token and user data
      await storage.saveToken(response.token);
      await storage.saveUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint if needed
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.clearAll();
    }
  },

  async getCurrentUser() {
    try {
      return await storage.getUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await storage.getToken();
    return !!token;
  },

  async refreshToken(): Promise<void> {
    try {
      const response = await api.post('/auth/refresh');
      await storage.saveToken(response.token);
    } catch (error) {
      await storage.clearAll();
      throw error;
    }
  },
};
