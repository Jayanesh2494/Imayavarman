import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="karate" size={100} color={theme.colors.primary} />
        </View>

        {/* Title */}
        <Text variant="headlineLarge" style={styles.title}>
          Silambam Training
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Welcome to Imayavarman Training Centre
        </Text>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text variant="bodyLarge" style={styles.description}>
            Learn traditional Tamil martial arts with Master Manikandan
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => router.push('/(auth)/login')}
            icon="login"
            style={styles.loginButton}
          >
            Login
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/(auth)/register')}
            icon="account-plus"
            style={styles.registerButton}
          >
            Register
          </Button>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          Excellence in Traditional Silambam
        </Text>
        <Text variant="bodySmall" style={styles.footerText}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primaryLight + '10',
    borderRadius: theme.borderRadius.round,
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  descriptionContainer: {
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: theme.spacing.xl,
  },
  loginButton: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  registerButton: {
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
  footerText: {
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
});
