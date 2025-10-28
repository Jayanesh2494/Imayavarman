import api from './api';
import { Fee, CreateFeeData } from '../types/fee';

export const feeService = {
  async getByStudent(studentId: string): Promise<Fee[]> {
    try {
      return await api.get(`/fees/student/${studentId}`);
    } catch (error) {
      throw error;
    }
  },

  async create(data: CreateFeeData): Promise<Fee> {
    try {
      return await api.post('/fees', data);
    } catch (error) {
      throw error;
    }
  },

  async recordPayment(feeId: string, paymentData: any): Promise<Fee> {
    try {
      return await api.post(`/fees/${feeId}/payment`, paymentData);
    } catch (error) {
      throw error;
    }
  },

  async getHistory(studentId: string): Promise<Fee[]> {
    try {
      return await api.get(`/fees/history/${studentId}`);
    } catch (error) {
      throw error;
    }
  },

  async getPending(): Promise<Fee[]> {
    try {
      return await api.get('/fees/pending');
    } catch (error) {
      throw error;
    }
  },

  async getOverdue(): Promise<Fee[]> {
    try {
      return await api.get('/fees/overdue');
    } catch (error) {
      throw error;
    }
  },
};
