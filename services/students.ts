import api from './api';
import axios from 'axios';
import { Student, CreateStudentData } from '../types/student';
import { Config } from '../constants/Config';

export const studentService = {
  async getAll(): Promise<Student[]> {
    try {
      return await api.get('/students');
    } catch (error) {
      throw error;
    }
  },

  async getById(id: string): Promise<Student> {
    try {
      return await api.get(`/students/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async create(data: CreateStudentData): Promise<Student> {
    try {
      return await api.post('/students', data);
    } catch (error) {
      throw error;
    }
  },

  async update(id: string, data: Partial<Student>): Promise<Student> {
    try {
      return await api.put(`/students/${id}`, data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      return await api.delete(`/students/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async enrollFace(studentId: string, imageBase64: string): Promise<any> {
    try {
      return await axios.post(`${Config.FACE_API_URL}/enroll`, {
        student_id: studentId,
        image: imageBase64,
      });
    } catch (error) {
      throw error;
    }
  },

  async search(query: string): Promise<Student[]> {
    try {
      return await api.get(`/students/search?q=${query}`);
    } catch (error) {
      throw error;
    }
  },

  async getActiveStudents(): Promise<Student[]> {
    try {
      return await api.get('/students?status=active');
    } catch (error) {
      throw error;
    }
  },
};
