// ─────────────────────────────────────────────
// useCamera — camera + location + save flow
// Encapsulates the entire AddEntry business logic:
//   1. Take photo
//   2. Auto-reverse-geocode current location
//   3. Save entry + trigger notification
// ─────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { TravelEntry } from '../types';
import { requestCameraPermission, launchCamera } from '../services/cameraService';
import { requestLocationPermission, getCurrentCoordinates, reverseGeocode } from '../services/locationService';
import { sendEntrySavedNotification } from '../services/notificationService';

interface UseCameraReturn {
  imageUri: string | null;
  address: string;
  isFetchingLocation: boolean;
  isSaving: boolean;
  handleTakePhoto: () => Promise<void>;
  handleSave: (onSave: (entry: TravelEntry) => Promise<boolean>) => Promise<boolean>;
  resetForm: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const [imageUri, setImageUri]                   = useState<string | null>(null);
  const [address, setAddress]                     = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSaving, setIsSaving]                   = useState(false);

  /**
   * Step 1 — Take photo.
   * Step 2 — Automatically fetch & reverse-geocode location.
   * Both permissions are checked before proceeding.
   */
  const handleTakePhoto = useCallback(async () => {
    // Check camera permission first
    const cameraGranted = await requestCameraPermission();
    if (!cameraGranted) {
      Alert.alert('Permission Denied', 'Camera access is required to take photos.');
      return;
    }

    const uri = await launchCamera();
    if (!uri) return; // User cancelled — do nothing

    setImageUri(uri);
    setAddress(''); // Clear any previous address

    // Auto-fetch location after photo is captured
    setIsFetchingLocation(true);
    try {
      const locationGranted = await requestLocationPermission();
      if (!locationGranted) {
        Alert.alert('Permission Denied', 'Location access is required to get your address.');
        setIsFetchingLocation(false);
        return;
      }

      const coords  = await getCurrentCoordinates();
      const resolved = await reverseGeocode(coords);
      setAddress(resolved);
    } catch (err) {
      console.error('[useCamera] Location error:', err);
      Alert.alert('Location Error', 'Could not retrieve your address. You can still save without it.');
      setAddress('Address unavailable');
    } finally {
      setIsFetchingLocation(false);
    }
  }, []);

  /**
   * Validate state, build TravelEntry, persist via onSave callback,
   * then fire a local notification on success.
   * Returns true if the save succeeded.
   */
  const handleSave = useCallback(
    async (onSave: (entry: TravelEntry) => Promise<boolean>): Promise<boolean> => {
      if (!imageUri) {
        Alert.alert('No Photo', 'Please take a photo before saving.');
        return false;
      }
      if (!address) {
        Alert.alert('No Address', 'Location is still being fetched. Please wait.');
        return false;
      }

      setIsSaving(true);
      try {
        const entry: TravelEntry = {
          id:        Date.now().toString(), // Simple unique ID
          imageUri,
          address,
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
    [imageUri, address],
  );

  /**
   * Reset all form state — called when user leaves without saving
   * or after a successful save. Ensures AddEntry screen is clean
   * every time the user navigates to it.
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