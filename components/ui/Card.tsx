import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: number;
}

export function Card({ children, onPress, style, elevation = 2 }: CardProps) {
  return (
    <PaperCard
      style={[styles.card, style]}
      elevation={elevation}
      onPress={onPress}
      mode="elevated"
    >
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
});
