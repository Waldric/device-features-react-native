# Travel Diary — React Native (Expo SDK 54)

A mobile app to add, view, and manage travel entries with photo capture,
reverse geocoding, AsyncStorage persistence, and local push notifications.

---

## Requirements

- Node.js 20 LTS
- Expo Go app (SDK 54) on a physical device
- An Expo account (free) for tunnel mode

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npx expo start --tunnel
```

Scan the QR code with the Expo Go app on your phone.

---

## Folder Structure

```
src/
├── types/            # TypeScript interfaces (TravelEntry, AppTheme, etc.)
├── constants/        # STORAGE_KEY, LIGHT_COLORS, DARK_COLORS
├── context/          # ThemeContext — dark/light mode global state
├── services/         # storageService, locationService, notificationService, cameraService
├── hooks/            # useEntries, useCamera, useTheme
├── components/       # EntryCard, EmptyState, ThemedView
└── features/
    ├── home/         # HomeScreen
    └── addEntry/     # AddEntryScreen
```

---

## Permissions Used

| Permission       | Why                                      |
|------------------|------------------------------------------|
| Camera           | Capture travel photos                    |
| Location         | Auto-fetch address via reverse geocoding |
| Notifications    | Confirm entry saved with local alert     |

---

## Key Packages

| Package                              | Version     |
|--------------------------------------|-------------|
| expo                                 | ~54.0.33    |
| react-native                         | 0.81.5      |
| react                                | 19.1.0      |
| @react-native-async-storage          | 2.2.0       |
| expo-image-picker                    | ~16.0.6     |
| expo-location                        | ~18.0.10    |
| expo-notifications                   | ~0.29.14    |
| expo-device                          | ~7.0.3      |
| expo-constants                       | ~17.0.8     |
| react-native-uuid                    | ^2.0.3      |
| @react-navigation/native-stack       | ^6.11.0     |
