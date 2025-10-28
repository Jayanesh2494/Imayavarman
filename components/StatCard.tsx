import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from './ui/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  onPress?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  color = '#FF6B35',
  onPress,
}: StatCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name={icon as any} size={32} color={color} />
        </View>
        <View style={styles.info}>
          <Text variant="headlineMedium" style={styles.value}>
            {value}
          </Text>
          <Text variant="bodyMedium" style={styles.title}>
            {title}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
  },
  title: {
    color: '#666',
    marginTop: 4,
  },
});
