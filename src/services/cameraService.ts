import * as ImagePicker from "expo-image-picker";
import { Linking, Platform } from "react-native";

export type CameraResult =
  | { status: "success"; uri: string }
  | { status: "cancelled" }
  | { status: "denied" };

/**
 * Request camera permission and launch camera.
 * Returns a typed result so the caller can handle
 * each case — success, cancelled, or denied.
 */
export const launchCamera = async (): Promise<CameraResult> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    return { status: "denied" };
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (result.canceled) {
    return { status: "cancelled" };
  }

  return { status: "success", uri: result.assets[0].uri };
};

// Check current camera permission without triggering OS dialog.

export const checkCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.getCameraPermissionsAsync();
  return status === "granted";
};

//Open device settings for manual camera permission grant.

export const openCameraSettings = (): void => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};
