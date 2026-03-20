import * as ImagePicker from 'expo-image-picker';

/**
 * Request camera permission from the OS.
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

/**
 * Launch camera and return the captured image URI.
 * Returns null if the user cancels.
 */
export const launchCamera = async (): Promise<string | null> => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality:       1,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};
