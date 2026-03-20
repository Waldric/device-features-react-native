import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useEntries } from '../../hooks/useEntries';
import { useTheme } from '../../hooks/useTheme';
import { useThemeContext } from '../../context/ThemeContext';
import EntryCard  from '../../components/EntryCard';
import EmptyState from '../../components/EmptyState';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
interface CustomToggleProps {
  isDark:   boolean;
  onToggle: () => void;
}

const PILL_WIDTH  = 80;
const PILL_HEIGHT = 36;
const THUMB_SIZE  = 30;
const THUMB_PAD   = 3;

const CustomToggle: React.FC<CustomToggleProps> = ({ isDark, onToggle }) => {
  const thumbAnim = useRef(
    new Animated.Value(isDark ? PILL_WIDTH - THUMB_SIZE - THUMB_PAD : THUMB_PAD)
  ).current;

  const handleToggle = () => {
    Animated.spring(thumbAnim, {
      toValue:         isDark
        ? THUMB_PAD
        : PILL_WIDTH - THUMB_SIZE - THUMB_PAD,
      useNativeDriver: true,
      speed:           20,
      bounciness:      6,
    }).start();
    onToggle();
  };

  return (
    <Pressable
      onPress={handleToggle}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="switch"
    >
      <View
        style={[
          styles.togglePill,
          { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' },
        ]}
      >
        {/* Sun icon*/}
        <View style={styles.toggleIconSlot}>
          <Ionicons
            name="sunny"
            size={16}
            color={isDark ? '#8E8E93' : '#FF9500'}
          />
        </View>

        {/* Moon icon  */}
        <View style={styles.toggleIconSlot}>
          <Ionicons
            name="moon"
            size={15}
            color={isDark ? '#636366' : '#8E8E93'}
          />
        </View>

        {/* Animated thumb*/}
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX: thumbAnim }],
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            },
          ]}
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={16}
            color={isDark ? '#AAAAFF' : '#FF9500'}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

// HomeScreen
const HomeScreen: React.FC = () => {
  const navigation                                        = useNavigation<HomeNavProp>();
  const { entries, isLoading, reload, handleRemoveEntry } = useEntries();
  const { theme }                                         = useTheme();
  const { toggleTheme }                                   = useThemeContext();
  const insets                                            = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Travel Diary
        </Text>
        <CustomToggle isDark={theme.dark} onToggle={toggleTheme} />
      </View>

      {/*Entries list */}
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onRemove={handleRemoveEntry}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={
          entries.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />

      {/* ── FAB ── */}
    {/*Floating Add Entry button */}
<View style={[styles.fabWrapper, { paddingBottom: insets.bottom + 16 }]}>
  <Pressable
    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
    onPress={() => navigation.navigate('AddEntry')}
    accessibilityLabel="Add new travel entry"
    accessibilityRole="button"
  >
    <Ionicons
      name="add"
      size={20}
      color={theme.colors.buttonText}
      style={styles.fabIcon}
    />
    <Text style={[styles.fabText, { color: theme.colors.buttonText }]}>
      Add Entry
    </Text>
  </Pressable>
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // Header
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 20,
    paddingBottom:     16,
  },
  headerTitle: {
    fontFamily:    'Inter_700Bold',
    fontSize:      30,
    letterSpacing: -0.5,
  },

  // Toggle pill
  togglePill: {
    width:          PILL_WIDTH,
    height:         PILL_HEIGHT,
    borderRadius:   PILL_HEIGHT / 2,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: THUMB_PAD + 4,
    position:       'relative',
    overflow:       'hidden',
  },
  toggleIconSlot: {
    width:          THUMB_SIZE,
    height:         THUMB_SIZE,
    alignItems:     'center',
    justifyContent: 'center',
  },
  toggleThumb: {
    position:       'absolute',
    top:            THUMB_PAD,
    width:          THUMB_SIZE,
    height:         THUMB_SIZE,
    borderRadius:   THUMB_SIZE / 2,
    alignItems:     'center',
    justifyContent: 'center',
    // Shadow for thumb depth
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 1 },
    shadowOpacity:  0.20,
    shadowRadius:   3,
    elevation:      3,
  },

  // List
  listContent: {
    paddingTop:    4,
    paddingBottom: 100,
  },
  emptyContainer: { 
    paddingTop: 60,
    alignItems: 'center',
  },

  // FAB
  fabWrapper: {
    position:   'absolute',
    bottom:     0,
    left:       0,
    right:      0,
    alignItems: 'center',
  },
  fabIcon: {
  marginRight: 6,
  },
 fab: {
  flexDirection:     'row',
  alignItems:        'center',
  justifyContent:    'center',
  paddingVertical:   14,
  paddingHorizontal: 32,
  borderRadius:      32,
  shadowColor:       '#000',
  shadowOffset:      { width: 0, height: 4 },
  shadowOpacity:     0.18,
  shadowRadius:      10,
  elevation:         6,
},
  fabText: {
    fontFamily:    'Inter_600SemiBold',
    fontSize:      16,
    letterSpacing: 0.2,
  },
});

export default HomeScreen;