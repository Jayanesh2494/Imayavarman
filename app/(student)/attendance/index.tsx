import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { attendanceService } from '../../../services/attendance';
import { AttendanceCard } from '../../../components/AttendanceCard';
import { Loading } from '../../../components/ui/Loading';
import { Attendance } from '../../../types/attendance';

export default function StudentAttendanceScreen() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    if (!user?.studentId) return;

    try {
      setLoading(true);
      const data = await attendanceService.getByStudent(user.studentId);
      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading attendance..." />;
  }

  if (attendance.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium">No attendance records yet</Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Your attendance will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={attendance}
        renderItem={({ item }) => <AttendanceCard attendance={item} />}
        keyExtractor={(item) => item._id}
        onRefresh={loadAttendance}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
});
