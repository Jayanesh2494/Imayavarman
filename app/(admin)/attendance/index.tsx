import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button as PaperButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FaceCapture } from '../../../components/FaceCapture';
import { attendanceService } from '../../../services/attendance';

export default function MarkAttendanceScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCapture = async (imageBase64: string) => {
    setLoading(true);
    try {
      const result = await attendanceService.markByFace(imageBase64);
      
      Alert.alert(
        'Success',
        result.message || 'Attendance marked successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally navigate to history
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Recognition Failed',
        error.message || 'Face not recognized. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Mark Attendance
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Position the student's face in the frame
        </Text>
      </View>

      <FaceCapture onCapture={handleCapture} loading={loading} />

      <View style={styles.footer}>
        <PaperButton
          mode="outlined"
          onPress={() => router.push('/(admin)/attendance/history')}
          style={styles.historyButton}
        >
          View History
        </PaperButton>
      </View>
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
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  historyButton: {
    backgroundColor: '#fff',
  },
});
