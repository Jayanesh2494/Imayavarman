import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AttendanceMainScreen() {
  const [method, setMethod] = useState<'face' | 'manual'>('face');
  const router = useRouter();

  const handleProceed = () => {
    if (method === 'face') {
      router.push('/(admin)/attendance/face');
    } else {
      router.push('/(admin)/attendance/manual');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons 
          name="checkbox-marked-circle-outline" 
          size={80} 
          color="#FF6B35" 
          style={styles.icon}
        />
        
        <Text variant="headlineMedium" style={styles.title}>
          Mark Attendance
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Choose your preferred method
        </Text>

        <SegmentedButtons
          value={method}
          onValueChange={(value) => setMethod(value as 'face' | 'manual')}
          buttons={[
            {
              value: 'face',
              label: 'Face Recognition',
              icon: 'face-recognition',
            },
            {
              value: 'manual',
              label: 'Manual Entry',
              icon: 'checkbox-marked',
            },
          ]}
          style={styles.segmented}
        />

        <View style={styles.description}>
          {method === 'face' ? (
            <>
              <Text variant="bodyMedium" style={styles.descText}>
                • Quick and automated
              </Text>
              <Text variant="bodyMedium" style={styles.descText}>
                • Uses camera for recognition
              </Text>
              <Text variant="bodyMedium" style={styles.descText}>
                • One student at a time
              </Text>
            </>
          ) : (
            <>
              <Text variant="bodyMedium" style={styles.descText}>
                • Mark multiple students at once
              </Text>
              <Text variant="bodyMedium" style={styles.descText}>
                • Checkbox-based interface
              </Text>
              <Text variant="bodyMedium" style={styles.descText}>
                • Present, Absent, or Late status
              </Text>
            </>
          )}
        </View>

        <Button onPress={handleProceed} style={styles.button}>
          Proceed with {method === 'face' ? 'Face Recognition' : 'Manual Entry'}
        </Button>

        <Button 
          mode="outlined" 
          onPress={() => router.push('/(admin)/attendance/history')}
          style={styles.button}
        >
          View History
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  segmented: {
    marginBottom: 20,
  },
  description: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  descText: {
    marginBottom: 8,
    color: '#666',
  },
  button: {
    marginBottom: 12,
  },
});
