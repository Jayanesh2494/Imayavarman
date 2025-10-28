import { useState, useEffect } from 'react';
import { studentService } from '../services/students';
import { Student } from '../types/student';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
      console.error('Load students error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const refetch = () => {
    loadStudents();
  };

  return {
    students,
    loading,
    error,
    refetch,
  };
};
