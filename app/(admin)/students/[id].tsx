import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button as PaperButton, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { studentService } from '../../../services/students';
import { Student } from '../../../types/student';
import { Loading } from '../../../components/ui/Loading';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const data = await studentService.getById(id);
      setStudent(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load student');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await studentService.delete(id);
              Alert.alert('Success', 'Student deleted successfully');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete student');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <Loading message="Loading student..." />;
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>Student not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={student.profileImage}
          label={student.name.charAt(0).toUpperCase()}
          size={100}
        />
        <Text variant="headlineMedium" style={styles.name}>
          {student.name}
        </Text>
        <Text
          variant="bodyLarge"
          style={[
            styles.status,
            { color: student.status === 'active' ? '#4CAF50' : '#F44336' },
          ]}
        >
          {student.status.toUpperCase()}
        </Text>
      </View>

      <Divider />

      <View style={styles.section}>
        <DetailRow label="Age" value={student.age.toString()} />
        <DetailRow label="Belt" value={student.belt || 'Beginner'} />
        <DetailRow
          label="Phone"
          value={student.phoneNumber || 'Not provided'}
        />
        <DetailRow label="Email" value={student.email || 'Not provided'} />
        <DetailRow label="Address" value={student.address || 'Not provided'} />
        <DetailRow
          label="Enrolled"
          value={new Date(student.enrollmentDate).toLocaleDateString()}
        />
      </View>

      <View style={styles.actions}>
        <Button mode="outlined" onPress={handleDelete}>
          Delete Student
        </Button>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text variant="titleMedium" style={styles.label}>
        {label}
      </Text>
      <Text variant="bodyLarge" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  actions: {
    padding: 16,
  },
});
