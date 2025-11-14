import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendance';
import { Attendance } from '../types/attendance';

export function useAttendance(studentId?: string) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = studentId 
        ? await attendanceService.getByStudent(studentId)
        : await attendanceService.getHistory();
      setAttendance(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [studentId]);

  return {
    attendance,
    loading,
    error,
    refetch: fetchAttendance,
  };
}
