// ─────────────────────────────────────────────
// EntryCard — single travel entry list item
// Shows: image, address, date, delete button
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { TravelEntry } from '../types';
import { useTheme } from '../hooks/useTheme';

interface EntryCardProps {
  entry:    TravelEntry;
  onRemove: (id: string) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onRemove }) => {
  const { theme } = useTheme();

  // Always confirm before a destructive delete action
  const confirmRemove = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to remove this travel memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onRemove(entry.id) },
      ],
    );
  };

  const formattedDate = new Date(entry.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      {/* Captured image thumbnail */}
      <Image source={{ uri: entry.imageUri }} style={styles.image} />

      {/* Address and date info */}
      <View style={styles.info}>
        <Text
          style={[styles.address, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {entry.address}
        </Text>
        <Text style={[styles.date, { color: theme.colors.subText }]}>
          {formattedDate}
        </Text>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        style={[styles.deleteBtn, { backgroundColor: theme.colors.danger }]}
        onPress={confirmRemove}
        accessibilityLabel="Delete entry"
        accessibilityRole="button"
      >
        <Text style={[styles.deleteBtnText, { color: theme.colors.buttonText }]}>
          Remove
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection:    'row',
    alignItems:       'center',
    marginHorizontal: 16,
    marginVertical:   8,
    borderRadius:     12,
    borderWidth:      1,
    padding:          10,
    gap:              10,
  },
  image: {
    width:           70,
    height:          70,
    borderRadius:    8,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
    gap:  4,
  },
  address: {
    fontSize:   14,
    fontWeight: '500',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
  },
  deleteBtn: {
    paddingVertical:   8,
    paddingHorizontal: 12,
    borderRadius:      8,
  },
  deleteBtnText: {
    fontSize:   13,
    fontWeight: '600',
  },
});

export default EntryCard;
