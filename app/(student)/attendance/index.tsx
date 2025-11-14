import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { attendanceService } from '../../../services/attendance';
import { AttendanceCard } from '../../../components/AttendanceCard';
import { Loading } from '../../../components/ui/Loading';
import { Attendance } from '../../../types/attendance';
import { Config } from '../../../constants/Config';

export default function StudentAttendanceScreen() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayStatus, setTodayStatus] = useState<'present' | 'absent' | 'late' | null>(null);

  useEffect(() => {
    loadAttendance();
    
    // Set up real-time polling
    if (Config.ENABLE_REAL_TIME) {
      const interval = setInterval(loadAttendance, Config.POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, []);

  const loadAttendance = async () => {
    if (!user?.studentId) {
      setLoading(false);
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      
      const data = await attendanceService.getByStudent(user.studentId);
      setAttendance(data);

      // Check today's status
      const today = new Date().toDateString();
      const todayAttendance = data.find(
        (att) => new Date(att.date).toDateString() === today
      );
      setTodayStatus(todayAttendance?.status || null);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendance();
  };

  // Calculate statistics
  const totalPresent = attendance.filter(a => a.status === 'present').length;
  const totalAbsent = attendance.filter(a => a.status === 'absent').length;
  const totalLate = attendance.filter(a => a.status === 'late').length;
  const attendanceRate = attendance.length > 0 
    ? ((totalPresent / attendance.length) * 100).toFixed(1)
    : '0';

  if (loading && !refreshing) {
    return <Loading message="Loading attendance..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          My Attendance
        </Text>
        
        {/* Today's Status */}
        <View style={styles.todayStatus}>
          <Text variant="titleMedium">Today's Status:</Text>
          {todayStatus ? (
            <Chip 
              mode="flat"
              style={[
                todayStatus === 'present' && styles.presentChip,
                todayStatus === 'late' && styles.lateChip,
                todayStatus === 'absent' && styles.absentChip,
              ]}
            >
              {todayStatus.toUpperCase()}
            </Chip>
          ) : (
            <Text variant="bodyMedium" style={styles.notMarked}>
              Not marked yet
            </Text>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {totalPresent}
            </Text>
            <Text variant="bodySmall">Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {totalLate}
            </Text>
            <Text variant="bodySmall">Late</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {totalAbsent}
            </Text>
            <Text variant="bodySmall">Absent</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={[styles.statNumber, styles.rateNumber]}>
              {attendanceRate}%
            </Text>
            <Text variant="bodySmall">Rate</Text>
          </View>
        </View>
      </View>

      {attendance.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No attendance records yet</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Your attendance will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={attendance}
          renderItem={({ item }) => <AttendanceCard attendance={item} />}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  todayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statusChip: {
    fontWeight: 'bold',
  },
  presentChip: {
    backgroundColor: '#E8F5E9',
  },
  lateChip: {
    backgroundColor: '#FFF3E0',
  },
  absentChip: {
    backgroundColor: '#FFEBEE',
  },
  notMarked: {
    color: '#999',
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  rateNumber: {
    color: '#4CAF50',
  },
  list: {
    paddingBottom: 16,
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
