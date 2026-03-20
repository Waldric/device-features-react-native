import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const EmptyState: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        No Entries yet
      </Text>
      <Text style={[styles.sub, { color: theme.colors.subText }]}>
        Tap the button below to add your first travel memory
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 40,
    paddingVertical:   150,
  },
  icon: {
    fontSize:     52,
    marginBottom: 20,
  },
  title: {
    fontFamily:    'Inter_600SemiBold',
    fontSize:      22,
    fontWeight:    '600',
    marginBottom:  10,
    textAlign:     'center',
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize:   14,
    textAlign:  'center',
    lineHeight: 22,
  },
});

export default EmptyState;