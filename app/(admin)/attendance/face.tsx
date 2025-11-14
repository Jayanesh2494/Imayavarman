import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { FaceCapture } from '../../../components/FaceCapture';
import { attendanceService } from '../../../services/attendance';

export default function FaceAttendanceScreen() {
  const [loading, setLoading] = useState(false);

  const handleCapture = async (imageBase64: string) => {
    setLoading(true);
    try {
      const result = await attendanceService.markByFace(imageBase64);
      
      Alert.alert(
        'Success',
        `Attendance marked for ${result.attendance.studentId.name}\nConfidence: ${(result.confidence! * 100).toFixed(1)}%`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Recognition Failed',
        error.message || 'Face not recognized. Please try again or use manual entry.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Face Recognition Attendance
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Position the student's face in the frame
        </Text>
      </View>

      <FaceCapture onCapture={handleCapture} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    color: '#666',
  },
});
