// ─────────────────────────────────────────────
// EmptyState — displayed when entries list is empty
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const EmptyState: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={[styles.title, { color: theme.colors.subText }]}>
        No Entries yet
      </Text>
      <Text style={[styles.sub, { color: theme.colors.subText }]}>
        Tap the button below to add your first travel memory.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize:     48,
    marginBottom: 16,
  },
  title: {
    fontSize:     20,
    fontWeight:   '600',
    marginBottom: 8,
    textAlign:    'center',
  },
  sub: {
    fontSize:   14,
    textAlign:  'center',
    lineHeight: 20,
  },
});

export default EmptyState;
