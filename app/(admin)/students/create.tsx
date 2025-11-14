import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { studentService } from '../../../services/students';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { validation } from '../../../utils/validation';
import { theme } from '../../../constants/theme';

export default function CreateStudentScreen() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phoneNumber: '',
    email: '',
    address: '',
    parentName: '',
    parentPhone: '',
    emergencyContact: '',
    belt: 'beginner' as any,
    medicalInfo: '',
    // Login credentials
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: any = {};

    // Basic Info
    if (!validation.required(formData.name)) {
      newErrors.name = 'Name is required';
    }
    if (!validation.required(formData.age) || !validation.number(formData.age)) {
      newErrors.age = 'Valid age is required';
    }
    if (!validation.required(formData.phoneNumber) || !validation.phone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Valid 10-digit phone number is required';
    }
    if (!validation.required(formData.email) || !validation.email(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    // Login Credentials
    if (!validation.required(formData.username)) {
      newErrors.username = 'Username is required';
    } else if (!validation.username(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore)';
    }
    if (!validation.required(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!validation.password(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      await studentService.create({
        ...formData,
        age: parseInt(formData.age),
      });

      Alert.alert(
        'Success',
        'Student created successfully with login credentials',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Student Information */}
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Student Information
        </Text>

        <Input
          label="Full Name *"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          error={errors.name}
        />

        <Input
          label="Age *"
          value={formData.age}
          onChangeText={(text) => updateField('age', text)}
          keyboardType="numeric"
          error={errors.age}
        />

        <Text variant="titleSmall" style={styles.label}>
          Gender *
        </Text>
        <SegmentedButtons
          value={formData.gender}
          onValueChange={(value) => updateField('gender', value)}
          buttons={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          style={styles.segmented}
        />

        <Input
          label="Phone Number *"
          value={formData.phoneNumber}
          onChangeText={(text) => updateField('phoneNumber', text)}
          keyboardType="phone-pad"
          error={errors.phoneNumber}
        />

        <Input
          label="Email Address *"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Address"
          value={formData.address}
          onChangeText={(text) => updateField('address', text)}
          multiline
          numberOfLines={3}
        />

        {/* Login Credentials */}
        <Text variant="titleLarge" style={[styles.sectionTitle, styles.sectionSpacing]}>
          Login Credentials
        </Text>

        <Input
          label="Username *"
          value={formData.username}
          onChangeText={(text) => updateField('username', text)}
          autoCapitalize="none"
          error={errors.username}
          placeholder="Student will use this to login"
        />

        <Input
          label="Password *"
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          secureTextEntry
          error={errors.password}
          placeholder="Minimum 6 characters"
        />

        {/* Parent/Guardian Information */}
        <Text variant="titleLarge" style={[styles.sectionTitle, styles.sectionSpacing]}>
          Parent/Guardian Information
        </Text>

        <Input
          label="Parent/Guardian Name"
          value={formData.parentName}
          onChangeText={(text) => updateField('parentName', text)}
        />

        <Input
          label="Parent Phone"
          value={formData.parentPhone}
          onChangeText={(text) => updateField('parentPhone', text)}
          keyboardType="phone-pad"
        />

        <Input
          label="Emergency Contact"
          value={formData.emergencyContact}
          onChangeText={(text) => updateField('emergencyContact', text)}
          keyboardType="phone-pad"
        />

        {/* Training Information */}
        <Text variant="titleLarge" style={[styles.sectionTitle, styles.sectionSpacing]}>
          Training Information
        </Text>

        <Text variant="titleSmall" style={styles.label}>
          Belt Level
        </Text>
        <SegmentedButtons
          value={formData.belt}
          onValueChange={(value) => updateField('belt', value)}
          buttons={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
          style={styles.segmented}
        />

        <Input
          label="Medical Information"
          value={formData.medicalInfo}
          onChangeText={(text) => updateField('medicalInfo', text)}
          multiline
          numberOfLines={3}
          placeholder="Any medical conditions, allergies, etc."
        />

        {/* Buttons */}
        <Button onPress={handleSubmit} loading={loading} style={styles.button}>
          Create Student
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          disabled={loading}
          style={styles.button}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  form: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  sectionSpacing: {
    marginTop: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  segmented: {
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});
