import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { SegmentedButtons, Text } from 'react-native-paper';
import { eventService } from '../../../../services/events';
import { Loading } from '../../../../components/ui/Loading';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'other' as any,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const event = await eventService.getById(id);
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date.split('T')[0],
        time: event.time || '',
        location: event.location || '',
        category: event.category,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load event');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await eventService.update(id, formData);
      Alert.alert('Success', 'Event updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading event..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Event Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />

        <Input
          label="Date (YYYY-MM-DD)"
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
        />

        <Input
          label="Time"
          value={formData.time}
          onChangeText={(text) => setFormData({ ...formData, time: text })}
        />

        <Input
          label="Location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
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

        <Button onPress={handleSubmit} loading={submitting} style={styles.button}>
          Update Event
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          disabled={submitting}
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
});
