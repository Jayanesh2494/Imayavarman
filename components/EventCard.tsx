import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { Card } from './ui/Card';
import { Event } from '../types/event';
import { formatDate } from '../utils/formatDate';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'competition': return '#FF6B35';
      case 'workshop': return '#2196F3';
      case 'ceremony': return '#9C27B0';
      case 'practice': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      {event.images && event.images.length > 0 && (
        <Image 
          source={{ uri: event.images[0] }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          {event.title}
        </Text>
        
        {event.description && (
          <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {formatDate(event.date)}
            </Text>
          </View>
          
          {event.time && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.infoText}>
                {event.time}
              </Text>
            </View>
          )}
        </View>

        {event.location && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {event.location}
            </Text>
          </View>
        )}

        <Chip 
          mode="flat" 
          style={[styles.chip, { backgroundColor: getCategoryColor(event.category) + '20' }]}
          textStyle={{ color: getCategoryColor(event.category) }}
        >
          {event.category.toUpperCase()}
        </Chip>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 12,
  },
  info: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});
