// ─────────────────────────────────────────────
// notificationService — expo-notifications layer
// Based on professor's NotificationScreen pattern
// Handles channel setup, permission, and scheduling
// in one reusable module
// ─────────────────────────────────────────────

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is foregrounded
// Mirrors the professor's setNotificationHandler pattern
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register the device for push notifications.
 * Sets up Android channel and requests permission.
 * Must be called once at app startup (from App.tsx).
 */
export const registerForNotifications = async (): Promise<void> => {
  // Android requires a named notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Push tokens only work on physical devices
  if (!Device.isDevice) {
    console.warn('[notificationService] Not a physical device — skipping token registration.');
    return;
  }

  // Check existing permission before requesting to avoid redundant prompts
  const { granted: existingPermission } = await Notifications.getPermissionsAsync();
  let finalPermission = existingPermission;

  if (!existingPermission) {
    const { granted: newPermission } = await Notifications.requestPermissionsAsync();
    finalPermission = newPermission;
  }

  if (!finalPermission) {
    console.warn('[notificationService] Notification permission denied.');
    return;
  }

  // Only fetch push token if projectId is configured (not required for local notifications)
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (projectId) {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('[notificationService] Expo Push Token:', token);
  }
};

/**
 * Schedule a local "entry saved" notification immediately.
 * Uses trigger: null so it fires right away — no scheduling delay.
 */
export const sendEntrySavedNotification = async (): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✈️ Travel Entry Saved!',
        body:  'Your travel memory has been added to your diary.',
        sound: 'default',
      },
      trigger: null, // Fire immediately
    });
  } catch (error) {
    // Non-critical — entry is already saved, notification failure is soft
    console.error('[notificationService] Failed to send notification:', error);
  }
};