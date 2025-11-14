import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { validation } from '../../utils/validation';
import { theme } from '../../constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const { signIn } = useAuth();
  const router = useRouter();

  const validateInputs = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!validation.required(username)) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!validation.required(password)) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await signIn(username, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => router.back()}
        style={styles.backButton}
        iconColor={theme.colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Admin Login
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            Sign in to manage your training centre
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors({ ...errors, username: '' });
            }}
            autoCapitalize="none"
            error={errors.username}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
            secureTextEntry
            error={errors.password}
          />

          <Button onPress={handleLogin} loading={loading} style={styles.button}>
            Login
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.helpText}>
          Contact Master Manikandan for account access
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  helpText: {
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});
