import React, { useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView } from 'expo-camera';
import { Button } from './ui/Button';
import { Text } from 'react-native-paper';
import { useCamera } from '../hooks/useCamera';

interface FaceCaptureProps {
  onCapture: (imageBase64: string) => void;
  loading?: boolean;
}

export function FaceCapture({ onCapture, loading }: FaceCaptureProps) {
  const cameraRef = useRef<CameraView>(null);
  const { permission, requestPermission, takePicture, isCapturing } = useCamera();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text variant="titleMedium" style={styles.permissionText}>
          Camera permission is required for face recognition
        </Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  const handleCapture = async () => {
    try {
      const photo = await takePicture(cameraRef.current);
      if (photo?.base64) {
        onCapture(photo.base64);
      } else {
        Alert.alert('Error', 'Failed to capture image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
      console.error('Capture error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="front">
        <View style={styles.overlay}>
          <View style={styles.faceGuide} />
        </View>
      </CameraView>

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleCapture}
          loading={loading || isCapturing}
          disabled={loading || isCapturing}
        >
          {loading ? 'Processing...' : 'Capture Face'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 150,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
