import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Checkbox, Divider, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { studentService } from '../../../services/students';
import { attendanceService } from '../../../services/attendance';
import { Student } from '../../../types/student';
import { Loading } from '../../../components/ui/Loading';
import { Button } from '../../../components/ui/Button';

interface StudentAttendance {
  student: Student;
  status: 'present' | 'absent' | 'late';
}

export default function ManualAttendanceScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, 'present' | 'absent' | 'late'>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch active students
      const studentsData = await studentService.getActiveStudents();
      setStudents(studentsData);

      // Fetch today's attendance
      const studentIds = studentsData.map(s => s._id);
      const todayAttendance = await attendanceService.getTodayByStudents(studentIds);

      // Initialize attendance map
      const attMap = new Map<string, 'present' | 'absent' | 'late'>();
      studentsData.forEach(student => {
        const existing = todayAttendance.get(student._id);
        attMap.set(student._id, existing?.status || 'absent');
      });
      
      setAttendance(attMap);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const newAttendance = new Map(attendance);
    newAttendance.set(studentId, status);
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attendanceData = Array.from(attendance.entries()).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await attendanceService.markManual(attendanceData);
      
      Alert.alert('Success', 'Attendance marked successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const markAllPresent = () => {
    const newAttendance = new Map(attendance);
    students.forEach(student => {
      newAttendance.set(student._id, 'present');
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = new Map(attendance);
    students.forEach(student => {
      newAttendance.set(student._id, 'absent');
    });
    setAttendance(newAttendance);
  };

  if (loading) {
    return <Loading message="Loading students..." />;
  }

  const presentCount = Array.from(attendance.values()).filter(s => s === 'present').length;
  const absentCount = Array.from(attendance.values()).filter(s => s === 'absent').length;
  const lateCount = Array.from(attendance.values()).filter(s => s === 'late').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Manual Attendance - {new Date().toLocaleDateString()}
        </Text>
        <View style={styles.stats}>
          <Text variant="bodyMedium">
            Present: {presentCount} • Absent: {absentCount} • Late: {lateCount}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Button mode="outlined" onPress={markAllPresent} style={styles.quickButton}>
            Mark All Present
          </Button>
          <Button mode="outlined" onPress={markAllAbsent} style={styles.quickButton}>
            Mark All Absent
          </Button>
        </View>
      </View>

      <ScrollView style={styles.list}>
        {students.map((student) => (
          <View key={student._id}>
            <View style={styles.studentItem}>
              <Text variant="titleMedium" style={styles.studentName}>
                {student.name}
              </Text>
              
              <SegmentedButtons
                value={attendance.get(student._id) || 'absent'}
                onValueChange={(value) => 
                  updateAttendance(student._id, value as 'present' | 'absent' | 'late')
                }
                buttons={[
                  { value: 'present', label: 'P', style: styles.buttonPresent },
                  { value: 'late', label: 'L', style: styles.buttonLate },
                  { value: 'absent', label: 'A', style: styles.buttonAbsent },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
            <Divider />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          onPress={handleSubmit} 
          loading={submitting}
          style={styles.submitButton}
        >
          Submit Attendance ({presentCount}/{students.length})
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stats: {
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickButton: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  studentItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    flex: 1,
  },
  segmentedButtons: {
    width: 180,
  },
  buttonPresent: {
    backgroundColor: '#E8F5E9',
  },
  buttonLate: {
    backgroundColor: '#FFF3E0',
  },
  buttonAbsent: {
    backgroundColor: '#FFEBEE',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  submitButton: {
    marginBottom: 0,
  },
});
