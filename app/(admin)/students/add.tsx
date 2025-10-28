import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { studentService } from '../../../services/students';
import { validation } from '../../../utils/validation';

export default function AddStudentScreen() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: any = {};

    if (!validation.required(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validation.required(formData.age)) {
      newErrors.age = 'Age is required';
    } else if (!validation.number(formData.age)) {
      newErrors.age = 'Age must be a number';
    } else if (!validation.age(parseInt(formData.age))) {
      newErrors.age = 'Age must be between 5 and 100';
    }

    if (formData.phoneNumber && !validation.phone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (formData.email && !validation.email(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await studentService.create({
        ...formData,
        age: parseInt(formData.age),
      });
      Alert.alert('Success', 'Student added successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add student');
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
        <Input
          label="Name *"
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

        <Input
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => updateField('phoneNumber', text)}
          keyboardType="phone-pad"
          error={errors.phoneNumber}
        />

        <Input
          label="Email"
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

        <Button onPress={handleSubmit} loading={loading} style={styles.button}>
          Add Student
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
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  button: {
    marginTop: 8,
  },
});
