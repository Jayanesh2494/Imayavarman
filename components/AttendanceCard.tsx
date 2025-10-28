import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from './ui/Card';
import { Attendance } from '../types/attendance';
import { formatDate, formatTime } from '../utils/formatDate';

interface AttendanceCardProps {
  attendance: Attendance;
  onPress?: () => void;
}

export function AttendanceCard({ attendance, onPress }: AttendanceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      case 'late':
        return '#FFC107';
      default:
        return '#666';
    }
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.info}>
          <Text variant="titleMedium">{attendance.studentId.name}</Text>
          <Text variant="bodyMedium" style={styles.date}>
            {formatDate(attendance.date)}
            {attendance.checkInTime && ` • ${formatTime(attendance.checkInTime)}`}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(attendance.status) },
          ]}
        >
          <Text style={styles.statusText}>{attendance.status.toUpperCase()}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
