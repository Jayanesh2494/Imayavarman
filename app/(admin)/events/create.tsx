import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SegmentedButtons, Text } from 'react-native-paper';
import { eventService } from '../../../services/events';
import { validation } from '../../../utils/validation';
import * as ImagePicker from 'expo-image-picker';

export default function CreateEventScreen() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'other' as any,
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: any = {};

    if (!validation.required(formData.title)) {
      newErrors.title = 'Title is required';
    }

    if (!validation.required(formData.date)) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await eventService.create({
        ...formData,
        images: selectedImage ? [selectedImage] : [],
      });
      Alert.alert('Success', 'Event created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
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
          label="Event Title *"
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          error={errors.title}
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          multiline
          numberOfLines={3}
        />

        <Input
          label="Date * (YYYY-MM-DD)"
          value={formData.date}
          onChangeText={(text) => updateField('date', text)}
          placeholder="2025-11-15"
          error={errors.date}
        />

        <Input
          label="Time"
          value={formData.time}
          onChangeText={(text) => updateField('time', text)}
          placeholder="09:00 AM"
        />

        <Input
          label="Location"
          value={formData.location}
          onChangeText={(text) => updateField('location', text)}
        />

        <Text variant="titleSmall" style={styles.label}>
          Category
        </Text>
        <SegmentedButtons
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value as any })}
          buttons={[
            { value: 'competition', label: 'Competition' },
            { value: 'workshop', label: 'Workshop' },
            { value: 'ceremony', label: 'Ceremony' },
            { value: 'other', label: 'Other' },
          ]}
          style={styles.segmented}
        />

        <Button mode="outlined" onPress={pickImage} style={styles.button}>
          {selectedImage ? 'Change Image' : 'Add Image'}
        </Button>

        {selectedImage && (
          <Text variant="bodySmall" style={styles.imageSelected}>
            ✓ Image selected
          </Text>
        )}

        <Button onPress={handleSubmit} loading={loading} style={styles.button}>
          Create Event
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
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  imageSelected: {
    color: '#4CAF50',
    marginTop: 4,
    marginLeft: 4,
  },
});
