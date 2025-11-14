import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { studentService } from '../../../services/students';
import { StudentCard } from '../../../components/StudentCard';
import { Loading } from '../../../components/ui/Loading';
import { theme } from '../../../constants/theme';

export default function StudentsScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchQuery, filter]);

  const loadStudents = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await studentService.getAll();
      
      // Handle both array and object responses
      const data = Array.isArray(response) ? response : (response as any).data || [];
      
      console.log('Students loaded:', data.length);
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(students)) {
      setFilteredStudents([]);
      return;
    }

    let filtered = [...students];

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(student => student.status === filter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phoneNumber?.includes(searchQuery)
      );
    }

    setFilteredStudents(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudents();
  };

  if (loading) {
    return <Loading message="Loading students..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search students..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          style={styles.filter}
        />
      </View>

      {filteredStudents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge" style={styles.emptyTitle}>
            No students found
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery
              ? 'No students match your search'
              : 'Add your first student to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onPress={() => router.push(`/(admin)/students/${item._id}`)}
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
        onPress={() => router.push('/(admin)/students/create')}
        label="Add Student"
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
