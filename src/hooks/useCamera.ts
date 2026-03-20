import { useState, useCallback, useRef } from "react";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { TravelEntry } from "../types";
import { launchCamera } from "../services/cameraService";
import {
  requestLocationPermission,
  getCurrentCoordinates,
  reverseGeocode,
} from "../services/locationService";
import { sendEntrySavedNotification } from "../services/notificationService";

export interface UseCameraReturn {
  imageUri: string | null;
  address: string;
  isFetchingLocation: boolean;
  isSaving: boolean;
  cameraBlocked: boolean;
  handleTakePhoto: () => Promise<void>;
  refetchAddress: () => Promise<void>;
  handleSave: (
    onSave: (entry: TravelEntry) => Promise<boolean>,
  ) => Promise<boolean>;
  resetForm: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraBlocked, setCameraBlocked] = useState(false);
  const isSaveInProgress = useRef(false);

  /**
   * Launch camera and handle all three outcomes:
   *   success   → store URI, fetch location
   *   cancelled → do nothing
   *   denied    → set cameraBlocked so UI shows the inline banner
   */
  const handleTakePhoto = useCallback(async () => {
    const result = await launchCamera();

    if (result.status === "denied") {
      setCameraBlocked(true);
      return;
    }

    if (result.status === "cancelled") {
      return;
    }

    setCameraBlocked(false);
    setImageUri(result.uri);
    setAddress("");

    setIsFetchingLocation(true);
    try {
      const locationGranted = await requestLocationPermission();
      if (!locationGranted) {
        setAddress("Address unavailable");
        return;
      }
      const coords = await getCurrentCoordinates();
      const resolved = await reverseGeocode(coords);
      setAddress(resolved);
    } catch (err) {
      console.error("[useCamera] Location error:", err);
      setAddress("Address unavailable");
    } finally {
      setIsFetchingLocation(false);
    }
  }, []);

  //Re-fetch address without retaking photo
  const refetchAddress = useCallback(async () => {
    if (!imageUri) return;
    setIsFetchingLocation(true);
    setAddress("");
    try {
      const locationGranted = await requestLocationPermission();
      if (!locationGranted) {
        setAddress("Address unavailable");
        return;
      }
      const coords = await getCurrentCoordinates();
      const resolved = await reverseGeocode(coords);
      setAddress(resolved);
    } catch (err) {
      console.error("[useCamera] refetchAddress error:", err);
      setAddress("Address unavailable");
    } finally {
      setIsFetchingLocation(false);
    }
  }, [imageUri]);

  //Validate > persist > notify.

  const handleSave = useCallback(
    async (
      onSave: (entry: TravelEntry) => Promise<boolean>,
    ): Promise<boolean> => {
      if (!imageUri) {
        Alert.alert("No Photo", "Please take a photo before saving.");
        return false;
      }
      if (isFetchingLocation) {
        Alert.alert("Please Wait", "Still fetching your location.");
        return false;
      }

      if (!address || address === "Address unavailable") {
        return new Promise((resolve) => {
          Alert.alert(
            "Location Unavailable",
            "This entry will be saved without an address. Grant location permission and use Retake Photo to add it.",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: "Save Without Address",
                style: "default",
                onPress: async () => resolve(await performSave(onSave)),
              },
            ],
          );
        });
      }

      return performSave(onSave);
    },
    [imageUri, address, isFetchingLocation],
  );

  const performSave = useCallback(
    async (
      onSave: (entry: TravelEntry) => Promise<boolean>,
    ): Promise<boolean> => {
      // Guard — prevents duplicate entries from rapid double-taps
      if (isSaveInProgress.current) {
        console.warn("[useCamera] Duplicate save tap ignored.");
        return false;
      }

      isSaveInProgress.current = true;
      setIsSaving(true);

      try {
        const entry: TravelEntry = {
          id: uuid.v4() as string,
          imageUri: imageUri!,
          address: address || "Address unavailable",
          createdAt: new Date().toISOString(),
        };
        const success = await onSave(entry);
        if (success) {
          await sendEntrySavedNotification();
          resetForm();
        }
        return success;
      } finally {
        isSaveInProgress.current = false;
        setIsSaving(false);
      }
    },
    [imageUri, address],
  );

  const resetForm = useCallback(() => {
    setImageUri(null);
    setAddress("");
    setCameraBlocked(false);
    isSaveInProgress.current = false; 
  }, []);

  return {
    imageUri,
    address,
    isFetchingLocation,
    isSaving,
    cameraBlocked,
    handleTakePhoto,
    refetchAddress,
    handleSave,
    resetForm,
  };
};
