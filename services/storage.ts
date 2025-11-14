import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const storage = {
  async saveToken(token: string): Promise<void> {
    try {
      if (isWeb) {
        localStorage.setItem('userToken', token);
      } else {
        await SecureStore.setItemAsync('userToken', token);
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem('userToken');
      } else {
        return await SecureStore.getItemAsync('userToken');
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (isWeb) {
        localStorage.removeItem('userToken');
      } else {
        await SecureStore.deleteItemAsync('userToken');
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async saveUser(user: any): Promise<void> {
    try {
      const userData = JSON.stringify(user);
      if (isWeb) {
        localStorage.setItem('userData', userData);
      } else {
        await SecureStore.setItemAsync('userData', userData);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      let data: string | null;
      if (isWeb) {
        data = localStorage.getItem('userData');
      } else {
        data = await SecureStore.getItemAsync('userData');
      }
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      if (isWeb) {
        localStorage.removeItem('userData');
      } else {
        await SecureStore.deleteItemAsync('userData');
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
