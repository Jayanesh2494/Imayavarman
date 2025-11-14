import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { eventService } from '../../../services/events';
import { Event } from '../../../types/event';
import { Loading } from '../../../components/ui/Loading';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatDate';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getById(id);
      setEvent(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load event');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventService.delete(id);
              Alert.alert('Success', 'Event deleted successfully');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <Loading message="Loading event..." />;
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {event.images && event.images.length > 0 && (
        <Image source={{ uri: event.images[0] }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {event.title}
        </Text>

        {event.description && (
          <Text variant="bodyLarge" style={styles.description}>
            {event.description}
          </Text>
        )}

        <Divider style={styles.divider} />

        <View style={styles.infoSection}>
          <InfoRow 
            icon="calendar" 
            label="Date" 
            value={formatDate(event.date)} 
          />
          {event.time && (
            <InfoRow icon="clock-outline" label="Time" value={event.time} />
          )}
          {event.location && (
            <InfoRow icon="map-marker" label="Location" value={event.location} />
          )}
          <InfoRow 
            icon="tag" 
            label="Category" 
            value={event.category.toUpperCase()} 
          />
        </View>

        <View style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={() => router.push(`/(admin)/events/edit/${event._id}`)}
            style={styles.actionButton}
          >
            Edit Event
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleDelete}
            style={styles.actionButton}
          >
            Delete Event
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon as any} size={20} color="#666" />
      <View style={styles.infoContent}>
        <Text variant="bodySmall" style={styles.infoLabel}>
          {label}
        </Text>
        <Text variant="bodyLarge" style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
    color: '#666',
  },
  divider: {
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: '500',
  },
  actions: {
    marginTop: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
});
