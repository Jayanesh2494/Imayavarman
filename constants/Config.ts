import { Platform } from 'react-native';
import Constants from 'expo-constants';

const ENV = {
  development: {
    apiUrl: Platform.select({
      web: 'http://localhost:3000/api',
      android: 'http://10.0.2.2:3000/api',
      ios: 'http://localhost:3000/api',
      default: 'http://localhost:3000/api',
    }),
    faceApiUrl: Platform.select({
      web: 'http://localhost:8000',
      android: 'http://10.0.2.2:8000',
      ios: 'http://localhost:8000',
      default: 'http://localhost:8000',
    }),
  },
  staging: {
    apiUrl: 'https://staging-api.imayavarman.com/api',
    faceApiUrl: 'https://staging-face-api.imayavarman.com',
  },
  production: {
    apiUrl: 'https://api.imayavarman.com/api',
    faceApiUrl: 'https://face-api.imayavarman.com',
  },
};

const getEnvVars = () => {
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  
  if (__DEV__) return ENV.development;
  if (releaseChannel === 'staging') return ENV.staging;
  return ENV.production;
};

const selectedENV = getEnvVars();

export const Config = {
  API_URL: selectedENV.apiUrl,
  FACE_API_URL: selectedENV.faceApiUrl,
  TIMEOUT: 30000,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ENABLE_REAL_TIME: true,
  POLLING_INTERVAL: 30000, // 30 seconds
  
  // App Info
  APP_NAME: 'Silambam Training',
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  BUILD_NUMBER: Constants.expoConfig?.ios?.buildNumber || '1',
  
  // Feature Flags
  FEATURES: {
    faceRecognition: true,
    manualAttendance: true,
    events: true,
    fees: true,
  },
};
