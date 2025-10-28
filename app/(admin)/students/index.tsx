import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useStudents } from '../../../hooks/useStudents';
import { StudentCard } from '../../../components/StudentCard';
import { Loading } from '../../../components/ui/Loading';
import { Text } from 'react-native-paper';

export default function StudentsScreen() {
  const { students, loading, refetch } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading message="Loading students..." />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search students..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {filteredStudents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No students found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery
              ? 'Try a different search term'
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
          onRefresh={refetch}
          refreshing={loading}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/students/add')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
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
