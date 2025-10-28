import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceService } from '../../services/attendance';
import { feeService } from '../../services/fees';
import { StatCard } from '../../components/StatCard';
import { Loading } from '../../components/ui/Loading';

export default function StudentHomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    attendanceCount: 0,
    pendingFees: 0,
  });

  const loadData = async () => {
    if (!user?.studentId) return;

    try {
      const [attendanceData, feeData] = await Promise.all([
        attendanceService.getByStudent(user.studentId),
        feeService.getByStudent(user.studentId),
      ]);

      setStats({
        attendanceCount: attendanceData.length,
        pendingFees: feeData.filter((f) => f.status === 'pending').length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <Loading message="Loading..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Welcome, {user?.username}!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Keep up the great work
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Classes Attended"
          value={stats.attendanceCount}
          icon="calendar-check"
          color="#4CAF50"
        />

        <StatCard
          title="Pending Fees"
          value={stats.pendingFees}
          icon="currency-usd"
          color="#FFC107"
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
  greeting: {
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
