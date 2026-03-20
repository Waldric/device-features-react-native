import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Alert,
  AppState,
  AppStateStatus,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useCamera } from "../../hooks/useCamera";
import { useEntries } from "../../hooks/useEntries";
import { useThemeContext } from "../../context/ThemeContext";
import {
  checkLocationPermission,
  openLocationSettings,
  requestLocationPermission,
} from "../../services/locationService";
import {
  checkNotificationPermission,
  ensureNotificationPermission,
} from "../../services/notificationService";

type AddEntryNavProp = NativeStackNavigationProp<RootStackParamList, "AddEntry">;

interface UseAddEntryReturn {
  imageUri:                string | null;
  address:                 string;
  isFetchingLocation:      boolean;
  isSaving:                boolean;
  cameraBlocked:           boolean;
  handleTakePhoto:         () => Promise<void>;
  locationGranted:         boolean;
  showNotifRationale:      boolean;
  showLocationRationale:   boolean;
  handleGrantLocation:     () => Promise<void>;
  handleGrantNotification: () => Promise<void>;
  onPressSave:             () => Promise<void>;
  isSaveDisabled:          boolean;
}

export const useAddEntry = (): UseAddEntryReturn => {
  const navigation         = useNavigation<AddEntryNavProp>();
  const { showToast }      = useThemeContext();
  const { handleAddEntry } = useEntries();

  const {
    imageUri,
    address,
    isFetchingLocation,
    isSaving,
    cameraBlocked,
    handleTakePhoto,
    refetchAddress,
    handleSave,
    resetForm,
  } = useCamera();

  const [locationGranted,    setLocationGranted]    = useState(true);
  const [showNotifRationale, setShowNotifRationale] = useState(false);
  const prevLocationGranted                         = useRef<boolean>(true);

  useEffect(() => {
    const initPermissions = async () => {
      const locGranted = await checkLocationPermission();
      setLocationGranted(locGranted);
      prevLocationGranted.current = locGranted;
    };

    initPermissions();

    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (nextState === "active") {
        const nowGranted = await checkLocationPermission();
        setLocationGranted(nowGranted);

        const nowNotif = await checkNotificationPermission();
        if (nowNotif) setShowNotifRationale(false);

        if (nowGranted && !prevLocationGranted.current) {
          showToast("Location permission granted!");
          if (imageUri) {
            await refetchAddress();
            showToast("Address updated successfully!");
          }
        }

        prevLocationGranted.current = nowGranted;
      } else {
        prevLocationGranted.current = await checkLocationPermission();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [imageUri, refetchAddress, showToast]);

  useEffect(() => {
    if (address && address !== "Address unavailable") {
      setLocationGranted(true);
    }
  }, [address]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
        setShowNotifRationale(false);
      };
    }, [resetForm]),
  );

  const handleGrantLocation = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      setLocationGranted(true);
      showToast("Location permission granted!");
      if (imageUri) {
        await refetchAddress();
        showToast("Address updated successfully!");
      }
    } else {
      openLocationSettings();
    }
  };

  const handleGrantNotification = async () => {
    const granted = await ensureNotificationPermission();
    if (granted) {
      setShowNotifRationale(false);
      showToast("Notifications enabled!");
      showSaveConfirmation();
    }
  };

  const showSaveConfirmation = () => {
    Alert.alert(
      "Save this entry?",
      "Photo and location will be saved to your travel diary. Tap Cancel to retake.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text:    "Save",
          style:   "default",
          onPress: async () => {
            const success = await handleSave(handleAddEntry);
            if (success) navigation.goBack();
          },
        },
      ],
    );
  };

  const onPressSave = async () => {
    if (!imageUri) {
      Alert.alert("No Photo", "Please take a photo before saving.");
      return;
    }
    if (isFetchingLocation) {
      Alert.alert("Please Wait", "Still fetching your location. Try again in a moment.");
      return;
    }

    const notificationGranted = await checkNotificationPermission();
    if (!notificationGranted) {
      setShowNotifRationale(true);
      return;
    }

    showSaveConfirmation();
  };

  const isSaveDisabled =
    !imageUri          ||
    isFetchingLocation ||
    isSaving           ||
    showNotifRationale;

  const showLocationRationale =
    !locationGranted &&
    !isFetchingLocation &&
    (!address || address === "Address unavailable");

  return {
    imageUri,
    address,
    isFetchingLocation,
    isSaving,
    cameraBlocked,
    handleTakePhoto,
    locationGranted,
    showNotifRationale,
    showLocationRationale,
    handleGrantLocation,
    handleGrantNotification,
    onPressSave,
    isSaveDisabled,
  };
};