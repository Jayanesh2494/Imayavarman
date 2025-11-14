import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, FAB, SegmentedButtons, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { eventService } from '../../../services/events';
import { EventCard } from '../../../components/EventCard';
import { Loading } from '../../../components/ui/Loading';
import { Event } from '../../../types/event';
import { theme } from '../../../constants/theme';

export default function AdminEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filter, searchQuery]);

  const loadEvents = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await eventService.getAll();
      
      // Handle both array and object responses safely
      const resAny = response as any;
      const data = Array.isArray(resAny)
        ? resAny
        : (Array.isArray(resAny?.data) ? resAny.data : []);
      
      console.log('Events loaded:', data.length);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(events)) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];

    // Filter by time
    if (filter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= new Date());
    } else if (filter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < new Date());
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredEvents(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  if (loading) {
    return <Loading message="Loading events..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search events..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
          ]}
          style={styles.filter}
        />
      </View>

      {filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge" style={styles.emptyTitle}>
            No events found
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery
              ? 'No events match your search'
              : 'Create your first event to get started'}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/events/create')}
        label="Add Event"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchBar: {
    marginBottom: theme.spacing.md,
  },
  filter: {
    marginBottom: theme.spacing.sm,
  },
  list: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
});
