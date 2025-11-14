import React from 'react';
import { StyleSheet } from 'react-native';
import { AboutContent } from '../../components/AboutContent';

export default function AdminAboutScreen() {
  return <AboutContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
