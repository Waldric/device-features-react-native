// ─────────────────────────────────────────────
// HomeScreen — main travel diary list view
// Features:
//   • FlatList of all saved TravelEntry items
//   • Delete with confirmation dialog
//   • Empty state when no entries exist
//   • Dark/Light mode toggle in header
//   • FAB-style Add button at the bottom
// ─────────────────────────────────────────────

import React, { useLayoutEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useEntries } from '../../hooks/useEntries';
import { useTheme } from '../../hooks/useTheme';
import EntryCard from '../../components/EntryCard';
import EmptyState from '../../components/EmptyState';
import ThemedView from '../../components/ThemedView';
import { useThemeContext } from '../../context/ThemeContext';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation                              = useNavigation<HomeNavProp>();
  const { entries, isLoading, handleRemoveEntry } = useEntries();
  const { theme }                               = useTheme();
  const { toggleTheme }                         = useThemeContext();

  // Inject the theme toggle button into the navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={styles.headerBtn}>
          <Text style={{ fontSize: 20 }}>{theme.dark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: theme.colors.card },
      headerTintColor: theme.colors.text,
    });
  }, [navigation, theme, toggleTheme]);

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntryCard entry={item} onRemove={handleRemoveEntry} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={
          entries.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />

      {/* Add Entry button — navigates to AddEntry screen */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddEntry')}
        accessibilityLabel="Add new travel entry"
        accessibilityRole="button"
      >
        <Text style={[styles.addBtnText, { color: theme.colors.buttonText }]}>
          + Add Entry
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 80, // Room for the Add button
  },
  emptyContainer: {
    flex: 1, // Allows EmptyState to fill the screen and center vertically
  },
  headerBtn: {
    marginRight: 8,
    padding: 4,
  },
  addBtn: {
    position:      'absolute',
    bottom:        24,
    alignSelf:     'center',
    paddingVertical:   14,
    paddingHorizontal: 36,
    borderRadius:  28,
    elevation:     4,
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius:  4,
  },
  addBtnText: {
    fontSize:   16,
    fontWeight: '700',
  },
});

export default HomeScreen;