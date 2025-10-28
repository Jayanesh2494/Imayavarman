import { useState } from 'react';
import { useCameraPermissions } from 'expo-camera';

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  const takePicture = async (cameraRef: any) => {
    if (!cameraRef || isCapturing) return null;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.takePictureAsync({
        base64: true,
        quality: 0.7,
        skipProcessing: false,
      });
      return photo;
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    permission,
    requestPermission,
    takePicture,
    isCapturing,
  };
};
