import api from './api';
import axios from 'axios';
import { Attendance, AttendanceStats, MarkAttendanceResponse } from '../types/attendance';
import { Config } from '../constants/Config';

export const attendanceService = {
  // Mark attendance by face recognition
  async markByFace(imageBase64: string): Promise<MarkAttendanceResponse> {
    try {
      // First, call face recognition service
      const faceResponse = await axios.post(`${Config.FACE_API_URL}/recognize`, {
        image: imageBase64,
      });

      // Then call backend to record attendance
      const response = await api.post('/attendance/mark', {
        studentId: faceResponse.data.student_id,
        method: 'face_recognition',
        confidence: faceResponse.data.confidence,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark manual attendance for multiple students
  async markManual(attendanceData: {
    studentId: string;
    status: 'present' | 'absent' | 'late';
  }[]): Promise<Attendance[]> {
    try {
      return await api.post('/attendance/mark-manual', {
        attendance: attendanceData,
      });
    } catch (error) {
      throw error;
    }
  },

  // Get today's attendance for all students (for manual marking)
  async getTodayByStudents(studentIds: string[]): Promise<Map<string, Attendance>> {
    try {
      const response = await api.post('/attendance/today-batch', {
        studentIds,
      });
      
      const attendanceMap = new Map<string, Attendance>();
      response.forEach((att: Attendance) => {
        attendanceMap.set(att.studentId._id || att.studentId, att);
      });
      
      return attendanceMap;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance by student
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

  // Get statistics
  async getStats(): Promise<AttendanceStats> {
    try {
      return await api.get('/attendance/stats');
    } catch (error) {
      throw error;
    }
  },

  // Get today's attendance
  async getToday(): Promise<Attendance[]> {
    try {
      return await api.get('/attendance/today');
    } catch (error) {
      throw error;
    }
  },

  // Get attendance history
  async getHistory(limit?: number): Promise<Attendance[]> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      return await api.get(`/attendance/history${params}`);
    } catch (error) {
      throw error;
    }
  },

  // Get attendance by date range
  async getByDateRange(startDate: string, endDate: string): Promise<Attendance[]> {
    try {
      return await api.get(`/attendance/range?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      throw error;
    }
  },

  // Update attendance status
  async updateStatus(
    attendanceId: string,
    status: 'present' | 'absent' | 'late'
  ): Promise<Attendance> {
    try {
      return await api.patch(`/attendance/${attendanceId}`, { status });
    } catch (error) {
      throw error;
    }
  },

  // Delete attendance record
  async delete(attendanceId: string): Promise<void> {
    try {
      return await api.delete(`/attendance/${attendanceId}`);
    } catch (error) {
      throw error;
    }
  },
};
