// ─────────────────────────────────────────────
// useCamera — full AddEntry business logic
// Flow: take photo → auto geocode → validate → save
// react-native-uuid used for proper unique IDs
// ─────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';
import { TravelEntry } from '../types';
import {
  requestCameraPermission,
  launchCamera,
} from '../services/cameraService';
import {
  requestLocationPermission,
  getCurrentCoordinates,
  reverseGeocode,
} from '../services/locationService';
import { sendEntrySavedNotification } from '../services/notificationService';

interface UseCameraReturn {
  imageUri:           string | null;
  address:            string;
  isFetchingLocation: boolean;
  isSaving:           boolean;
  handleTakePhoto:    () => Promise<void>;
  handleSave:         (onSave: (entry: TravelEntry) => Promise<boolean>) => Promise<boolean>;
  resetForm:          () => void;
}

export const useCamera = (): UseCameraReturn => {
  const [imageUri,           setImageUri]           = useState<string | null>(null);
  const [address,            setAddress]            = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSaving,           setIsSaving]           = useState(false);

  /**
   * Step 1 — Request camera permission and launch camera.
   * Step 2 — On capture, auto-fetch and reverse-geocode location.
   * Both steps guard against permission denial gracefully.
   */
  const handleTakePhoto = useCallback(async () => {
    const cameraGranted = await requestCameraPermission();
    if (!cameraGranted) {
      Alert.alert(
        'Camera Permission Denied',
        'Please enable camera access in your device settings.',
      );
      return;
    }

    const uri = await launchCamera();
    if (!uri) return; // User cancelled — no action needed

    setImageUri(uri);
    setAddress('');

    // Immediately begin location fetch after photo is captured
    setIsFetchingLocation(true);
    try {
      const locationGranted = await requestLocationPermission();
      if (!locationGranted) {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your device settings.',
        );
        setAddress('Address unavailable');
        return;
      }

      const coords   = await getCurrentCoordinates();
      const resolved = await reverseGeocode(coords);
      setAddress(resolved);
    } catch (err) {
      console.error('[useCamera] Location fetch error:', err);
      Alert.alert(
        'Location Error',
        'Could not retrieve your address. Entry can still be saved.',
      );
      setAddress('Address unavailable');
    } finally {
      setIsFetchingLocation(false);
    }
  }, []);

  /**
   * Validate → build entry → persist → notify on success.
   * Accepts onSave as a callback to stay decoupled from storage.
   */
  const handleSave = useCallback(
    async (onSave: (entry: TravelEntry) => Promise<boolean>): Promise<boolean> => {
      if (!imageUri) {
        Alert.alert('No Photo', 'Please take a photo before saving.');
        return false;
      }
      if (isFetchingLocation) {
        Alert.alert('Please Wait', 'Still fetching your location.');
        return false;
      }

      setIsSaving(true);
      try {
        const entry: TravelEntry = {
          id:        uuid.v4() as string, // Proper UUID via react-native-uuid
          imageUri,
          address:   address || 'Address unavailable',
          createdAt: new Date().toISOString(),
        };

        const success = await onSave(entry);
        if (success) {
          await sendEntrySavedNotification();
          resetForm();
        }
        return success;
      } finally {
        setIsSaving(false);
      }
    },
    [imageUri, address, isFetchingLocation],
  );

  /**
   * Clear all form state.
   * Called after successful save and on screen blur
   * to ensure AddEntry is always clean on re-entry.
   */
  const resetForm = useCallback(() => {
    setImageUri(null);
    setAddress('');
  }, []);

  return {
    imageUri,
    address,
    isFetchingLocation,
    isSaving,
    handleTakePhoto,
    handleSave,
    resetForm,
  };
};
