// ─────────────────────────────────────────────
// cameraService — expo-image-picker abstraction
// Based on professor's CameraScreen pattern
// Handles permission request and camera launch
// ─────────────────────────────────────────────

import * as ImagePicker from 'expo-image-picker';

/**
 * Request camera permission from the OS.
 * Returns true if granted, false otherwise.
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

/**
 * Launch the device camera and return the captured image URI.
 * Returns null if the user cancels without taking a photo.
 * Mirrors the professor's launchCameraAsync pattern.
 */
export const launchCamera = async (): Promise<string | null> => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1, // Highest quality — matches professor's example
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};