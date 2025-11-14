import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { eventService } from '../../../services/events';
import { EventCard } from '../../../components/EventCard';
import { Loading } from '../../../components/ui/Loading';
import { Event } from '../../../types/event';

export default function StudentEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

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
    if (filter === 'upcoming') {
      return new Date(event.date) >= new Date();
    }
    if (filter === 'past') {
      return new Date(event.date) < new Date();
    }
    return true;
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
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
          { value: 'all', label: 'All' },
        ]}
        style={styles.filter}
      />

      {filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No events found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item._id}
          onRefresh={loadEvents}
          refreshing={loading}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
