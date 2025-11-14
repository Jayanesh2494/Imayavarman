import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, SegmentedButtons, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { eventService } from '../../../services/events';
import { EventCard } from '../../../components/EventCard';
import { Loading } from '../../../components/ui/Loading';
import { Event } from '../../../types/event';

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return new Date(event.date) >= new Date();
    }
    return event.category === filter;
  });

  if (loading) {
    return <Loading message="Loading events..." />;
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'competition', label: 'Competition' },
          { value: 'workshop', label: 'Workshop' },
        ]}
        style={styles.filter}
      />

      {filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No events found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Create your first event to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/(admin)/events/${item._id}`)}
            />
          )}
          keyExtractor={(item) => item._id}
          onRefresh={loadEvents}
          refreshing={loading}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/events/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filter: {
    margin: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FF6B35',
  },
});
