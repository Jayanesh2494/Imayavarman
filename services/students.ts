import api from './api';
import { Student } from '../types/student';

export const studentService = {
  async getAll(): Promise<Student[]> {
    const response = await api.get('/students');
    // Handle both formats: direct array or { data: [] }
    return Array.isArray(response.data) ? response.data : (response.data.data || []);
  },

  async getById(id: string): Promise<Student> {
    const response = await api.get(`/students/${id}`);
    return response.data.data || response.data;
  },

  async create(data: Partial<Student>): Promise<Student> {
    const response = await api.post('/students', data);
    return response.data.data || response.data;
  },

  async update(id: string, data: Partial<Student>): Promise<Student> {
    const response = await api.put(`/students/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },

  async search(query: string): Promise<Student[]> {
    const response = await api.get(`/students/search?q=${query}`);
    return Array.isArray(response.data) ? response.data : (response.data.data || []);
  },
};
