// ─────────────────────────────────────────────
// notificationService — expo-notifications layer
// Based on professor's NotificationScreen pattern
// ─────────────────────────────────────────────

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Show alert when a notification arrives while app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Set up Android notification channel and request permission.
 * Call once at app startup from App.tsx.
 */
export const registerForNotifications = async (): Promise<void> => {
  // Android requires a named channel — must be created before scheduling
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name:             'default',
      importance:       Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.warn('[notificationService] Physical device required for push tokens.');
    return;
  }

  // Check before requesting to avoid redundant OS prompts
  const { granted: already } = await Notifications.getPermissionsAsync();
  let granted = already;

  if (!already) {
    const { granted: fresh } = await Notifications.requestPermissionsAsync();
    granted = fresh;
  }

  if (!granted) {
    console.warn('[notificationService] Notification permission denied.');
    return;
  }

  // Push token only needed if EAS projectId is configured
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (projectId) {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log('[notificationService] Push token:', token);
  }
};

/**
 * Fire an immediate local notification after saving an entry.
 * trigger: null means fire right away — no delay.
 */
export const sendEntrySavedNotification = async (): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✈️ Travel Entry Saved!',
        body:  'Your travel memory has been added to your diary.',
        sound: 'default',
      },
      trigger: null,
    });
  } catch (error) {
    // Non-critical — entry is already saved, soft fail here is acceptable
    console.error('[notificationService] Failed to send notification:', error);
  }
};
