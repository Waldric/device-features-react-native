import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert, Linking } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge:  false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


//Register notification channel and permissions at app startup.

export const registerForNotifications = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name:             'default',
      importance:       Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.warn('[notificationService] Physical device required.');
    return;
  }

  const { granted: existingPermission } =
    await Notifications.getPermissionsAsync();
  let finalPermission = existingPermission;

  if (!existingPermission) {
    const { granted: newPermission } =
      await Notifications.requestPermissionsAsync();
    finalPermission = newPermission;
  }

  if (!finalPermission) {
    console.warn('[notificationService] Notification permission denied.');
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (projectId) {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log('[notificationService] Push token:', token);
  }
};

/**
 * Check if notification permission is currently granted
 * without triggering the OS dialog.
 */
export const checkNotificationPermission = async (): Promise<boolean> => {
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
};

/**
 * Request notification permission.
 * If permanently denied, shows alert with Settings option.
 * Returns true if granted.
 */
export const ensureNotificationPermission = async (): Promise<boolean> => {
  if (!Device.isDevice) return false;

  const { granted: existingPermission } =
    await Notifications.getPermissionsAsync();
  let finalPermission = existingPermission;

  if (!existingPermission) {
    const { granted: newPermission } =
      await Notifications.requestPermissionsAsync();
    finalPermission = newPermission;
  }

  if (!finalPermission) {
    Alert.alert(
      'Notifications Disabled',
      'Enable notifications to receive a confirmation when your entry is saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text:    'Open Settings',
          onPress: () => openNotificationSettings(),
        },
      ],
    );
    return false;
  }

  return true;
};


//Open device settings for manual notification permission grant.

export const openNotificationSettings = (): void => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};


// Launch an immediate local notification after saving an entry.

export const sendEntrySavedNotification = async (): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✈️ Travel Entry Saved!',
        body:  'Your travel memory has been added to your diary.',
        sound: 'default',
      },
      trigger: {
        type:    Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  } catch (error) {
    console.error('[notificationService] Failed to send notification:', error);
  }
};