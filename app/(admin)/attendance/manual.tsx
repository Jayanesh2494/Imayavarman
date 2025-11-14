import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Checkbox, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { studentService } from '../../../services/students';
import { attendanceService } from '../../../services/attendance';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import { Card } from '../../../components/ui/Card';
import { theme } from '../../../constants/theme';

interface AttendanceRecord {
  studentId: string;
  name: string;
  status: 'present' | 'absent' | 'late';
}

export default function ManualAttendanceScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      
      // Filter active students
      const activeStudents = data.filter((s: any) => s.status === 'active');
      setStudents(activeStudents);

      // Initialize attendance records
      const records = activeStudents.map((student: any) => ({
        studentId: student._id,
        name: student.name,
        status: 'absent' as const,
      }));
      setAttendance(records);

      // Load today's attendance
      await loadTodayAttendance(activeStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadTodayAttendance = async (studentsList: any[]) => {
    try {
      const todayAttendance = await attendanceService.getToday();

      // Update attendance records with today's data
      setAttendance(prev =>
        prev.map(record => {
          const existing = todayAttendance.find(
            (a: any) => a.studentId === record.studentId
          );
          return existing
            ? { ...record, status: existing.status }
            : record;
        })
      );
    } catch (error) {
      console.error('Error loading today attendance:', error);
    }
  };

  const toggleStatus = (studentId: string) => {
    setAttendance(prev =>
      prev.map(record => {
        if (record.studentId === studentId) {
          const statuses: Array<'present' | 'absent' | 'late'> = ['present', 'late', 'absent'];
          const currentIndex = statuses.indexOf(record.status);
          const nextIndex = (currentIndex + 1) % statuses.length;
          return { ...record, status: statuses[nextIndex] };
        }
        return record;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const attendanceData = attendance.map(record => ({
        studentId: record.studentId,
        status: record.status,
      }));

      await attendanceService.markManual(attendanceData);

      Alert.alert(
        'Success',
        'Attendance marked successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAttendance = attendance.filter(record =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    late: attendance.filter(a => a.status === 'late').length,
    absent: attendance.filter(a => a.status === 'absent').length,
  };

  if (loading) {
    return <Loading message="Loading students..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Manual Attendance
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <Searchbar
          placeholder="Search students..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={[styles.statNumber, { color: theme.colors.present }]}>
              {stats.present}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={[styles.statNumber, { color: theme.colors.late }]}>
              {stats.late}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Late</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={[styles.statNumber, { color: theme.colors.absent }]}>
              {stats.absent}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Absent</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredAttendance}
        keyExtractor={(item) => item.studentId}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => toggleStatus(item.studentId)}>
            <View style={styles.studentRow}>
              <Text variant="titleMedium" style={styles.studentName}>
                {item.name}
              </Text>
              <View style={styles.statusContainer}>
                <Text
                  style={[
                    styles.statusBadge,
                    item.status === 'present' && styles.presentBadge,
                    item.status === 'late' && styles.lateBadge,
                    item.status === 'absent' && styles.absentBadge,
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          disabled={submitting}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitButton}
        >
          Submit Attendance
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    marginBottom: theme.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    flex: 1,
    color: theme.colors.text,
  },
  statusContainer: {
    marginLeft: theme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.sm,
  },
  presentBadge: {
    backgroundColor: theme.colors.present + '20',
    color: theme.colors.present,
  },
  lateBadge: {
    backgroundColor: theme.colors.late + '20',
    color: theme.colors.late,
  },
  absentBadge: {
    backgroundColor: theme.colors.absent + '20',
    color: theme.colors.absent,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
