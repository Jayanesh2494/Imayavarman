import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { attendanceService } from '../../services/attendance';
import { studentService } from '../../services/students';
import { Loading } from '../../components/ui/Loading';
import { StatCard } from '../../components/StatCard';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    presentToday: 0,
    attendanceRate: '0',
  });

  const loadStats = async () => {
    try {
      const [attendanceStats, students] = await Promise.all([
        attendanceService.getStats(),
        studentService.getAll(),
      ]);

      setStats({
        totalStudents: students.length,
        activeStudents: students.filter((s) => s.status === 'active').length,
        presentToday: attendanceStats.presentToday,
        attendanceRate: attendanceStats.attendanceRate,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Dashboard
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Overview of your training centre
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="account-group"
          color="#FF6B35"
        />

        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="account-check"
          color="#4CAF50"
        />

        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon="calendar-check"
          color="#2196F3"
        />

        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="chart-line"
          color="#9C27B0"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
  },
});
