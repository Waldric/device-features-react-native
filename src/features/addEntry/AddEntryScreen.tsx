// ─────────────────────────────────────────────
// AddEntryScreen — camera + location + save flow
// Features:
//   • Take photo via camera
//   • Auto-fetch + display current address
//   • Save entry to AsyncStorage + send notification
//   • Reset form if user leaves without saving
//     (useFocusEffect detects navigation away)
// ─────────────────────────────────────────────

import React, { useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useCamera } from '../../hooks/useCamera';
import { useEntries } from '../../hooks/useEntries';
import { useTheme } from '../../hooks/useTheme';
import ThemedView from '../../components/ThemedView';

type AddEntryNavProp = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;

const AddEntryScreen: React.FC = () => {
  const navigation = useNavigation<AddEntryNavProp>();
  const { theme }  = useTheme();

  const {
    imageUri,
    address,
    isFetchingLocation,
    isSaving,
    handleTakePhoto,
    handleSave,
    resetForm,
  } = useCamera();

  const { handleAddEntry } = useEntries();

  // Style the header to match the active theme
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle:    { backgroundColor: theme.colors.card },
      headerTintColor: theme.colors.text,
    });
  }, [navigation, theme]);

  /**
   * useFocusEffect fires every time this screen loses focus.
   * If the user pressed Back without saving, reset the form
   * so the screen is clean the next time they open it.
   */
  useFocusEffect(
    useCallback(() => {
      // Return a cleanup function — runs on blur (leaving the screen)
      return () => {
        resetForm();
      };
    }, [resetForm]),
  );

  /**
   * Save flow:
   *  1. Validate image + address (inside useCamera)
   *  2. Persist to AsyncStorage via useEntries
   *  3. Trigger local notification
   *  4. Navigate back to Home on success
   */
  const onPressSave = async () => {
    const success = await handleSave(handleAddEntry);
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <ThemedView>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Camera section ── */}
        <TouchableOpacity
          style={[
            styles.cameraBox,
            {
              borderColor:     theme.colors.border,
              backgroundColor: theme.colors.card,
            },
          ]}
          onPress={handleTakePhoto}
          disabled={isSaving}
          accessibilityLabel="Open camera"
          accessibilityRole="button"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <Text style={[styles.cameraPlaceholder, { color: theme.colors.subText }]}>
              📷  Tap to take a photo
            </Text>
          )}
        </TouchableOpacity>

        {/* Retake option once an image is captured */}
        {imageUri && (
          <TouchableOpacity onPress={handleTakePhoto} disabled={isSaving}>
            <Text style={[styles.retakeText, { color: theme.colors.primary }]}>
              Retake photo
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Location section ── */}
        <View style={[styles.addressBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          {isFetchingLocation ? (
            <View style={styles.row}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.addressText, { color: theme.colors.subText, marginLeft: 8 }]}>
                Fetching location…
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.addressText,
                { color: address ? theme.colors.text : theme.colors.subText },
              ]}
            >
              {address || '📍 Address will appear after taking a photo'}
            </Text>
          )}
        </View>

        {/* ── Save button ── */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            {
              backgroundColor:
                isSaving || !imageUri || isFetchingLocation
                  ? theme.colors.border      // Visually disabled
                  : theme.colors.primary,
            },
          ]}
          onPress={onPressSave}
          disabled={isSaving || !imageUri || isFetchingLocation}
          accessibilityLabel="Save travel entry"
          accessibilityRole="button"
        >
          {isSaving ? (
            <ActivityIndicator color={theme.colors.buttonText} />
          ) : (
            <Text style={[styles.saveBtnText, { color: theme.colors.buttonText }]}>
              Save Entry
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding:    20,
    alignItems: 'stretch',
    gap:        16,
  },
  cameraBox: {
    height:         220,
    borderRadius:   12,
    borderWidth:    1,
    borderStyle:    'dashed',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  },
  preview: {
    width:  '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraPlaceholder: {
    fontSize: 16,
  },
  retakeText: {
    textAlign:  'center',
    fontSize:   14,
    fontWeight: '500',
    marginTop:  -8, // Pull closer to the camera box
  },
  addressBox: {
    borderRadius: 10,
    borderWidth:  1,
    padding:      14,
    minHeight:    56,
    justifyContent: 'center',
  },
  addressText: {
    fontSize:   14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius:    10,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       8,
  },
  saveBtnText: {
    fontSize:   16,
    fontWeight: '700',
  },
});

export default AddEntryScreen;