import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card as PaperCard } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { studentService } from '../../../services/students';
import { attendanceService } from '../../../services/attendance';
import { Loading } from '../../../components/ui/Loading';
import { StatCard } from '../../../components/StatCard';

export default function StudentHomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: '0',
    studentName: user?.username || 'Student',
    belt: 'Beginner',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (user?.studentId) {
        const studentData = await studentService.getById(user.studentId);
        const attendanceData = await attendanceService.getByStudent(user.studentId);
        
        const present = attendanceData.filter(a => a.status === 'present').length;
        const absent = attendanceData.filter(a => a.status === 'absent').length;
        const total = attendanceData.length;
        const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

        setStats({
          totalPresent: present,
          totalAbsent: absent,
          attendanceRate: rate,
          studentName: studentData.name,
          belt: studentData.belt || 'Beginner',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <PaperCard style={styles.welcomeCard}>
        <PaperCard.Content>
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Welcome, {stats.studentName}!
          </Text>
          <Text variant="titleMedium" style={styles.beltText}>
            {stats.belt}
          </Text>
        </PaperCard.Content>
      </PaperCard>

      <View style={styles.statsContainer}>
        <StatCard
          title="Days Present"
          value={stats.totalPresent}
          icon="check-circle"
          color="#4CAF50"
        />
        <StatCard
          title="Days Absent"
          value={stats.totalAbsent}
          icon="close-circle"
          color="#F44336"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="chart-line"
          color="#2196F3"
        />
      </View>

      <PaperCard style={styles.infoCard}>
        <PaperCard.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Quick Info
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            📍 Imayavarman Training Centre
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            👨‍🏫 Master: Manikandan
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            🕒 Training: Mon-Sat, 6:00 AM - 8:00 PM
          </Text>
        </PaperCard.Content>
      </PaperCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: '#FF6B35',
  },
  welcomeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  beltText: {
    color: '#fff',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
  },
  infoCard: {
    margin: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF6B35',
  },
  infoText: {
    marginBottom: 8,
  },
});
