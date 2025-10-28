import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { attendanceService } from '../../../services/attendance';
import { AttendanceCard } from '../../../components/AttendanceCard';
import { Loading } from '../../../components/ui/Loading';
import { Attendance } from '../../../types/attendance';

export default function AttendanceHistoryScreen() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getHistory(50);
      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = attendance.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (loading) {
    return <Loading message="Loading attendance..." />;
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'present', label: 'Present' },
          { value: 'absent', label: 'Absent' },
          { value: 'late', label: 'Late' },
        ]}
        style={styles.filter}
      />

      {filteredAttendance.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No attendance records</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAttendance}
          renderItem={({ item }) => <AttendanceCard attendance={item} />}
          keyExtractor={(item) => item._id}
          onRefresh={loadAttendance}
          refreshing={loading}
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
  filter: {
    margin: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
