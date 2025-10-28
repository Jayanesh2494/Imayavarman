import api from './api';
import { Attendance, AttendanceStats, MarkAttendanceResponse } from '../types/attendance';

export const attendanceService = {
  async markByFace(imageBase64: string): Promise<MarkAttendanceResponse> {
    try {
      return await api.post('/attendance/mark', { image: imageBase64 });
    } catch (error) {
      throw error;
    }
  },

  async getByStudent(
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      return await api.get(`/attendance/student/${studentId}?${params}`);
    } catch (error) {
      throw error;
    }
  },

  async getStats(): Promise<AttendanceStats> {
    try {
      return await api.get('/attendance/stats');
    } catch (error) {
      throw error;
    }
  },

  async getToday(): Promise<Attendance[]> {
    try {
      return await api.get('/attendance/today');
    } catch (error) {
      throw error;
    }
  },

  async getHistory(limit?: number): Promise<Attendance[]> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      return await api.get(`/attendance/history${params}`);
    } catch (error) {
      throw error;
    }
  },
};
