import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  onPress?: () => void;
}

export function StudentCard({ student, onPress }: StudentCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <Avatar
          source={student.profileImage}
          label={student.name.charAt(0).toUpperCase()}
          size={50}
        />
        <View style={styles.info}>
          <Text variant="titleMedium">{student.name}</Text>
          <Text variant="bodyMedium" style={styles.details}>
            Age: {student.age} • {student.belt || 'Beginner'}
          </Text>
          <Text
            variant="bodySmall"
            style={[
              styles.status,
              student.status === 'active' ? styles.active : styles.inactive,
            ]}
          >
            {student.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  details: {
    color: '#666',
    marginTop: 4,
  },
  status: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  active: {
    color: '#4CAF50',
  },
  inactive: {
    color: '#F44336',
  },
});
