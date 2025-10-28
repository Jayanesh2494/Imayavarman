import * as SecureStore from 'expo-secure-store';

export const storage = {
  // Token management
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('userToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('userToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('userToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // User data management
  async saveUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const data = await SecureStore.getItemAsync('userData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('userData');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
