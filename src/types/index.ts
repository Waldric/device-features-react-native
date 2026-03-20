// ─────────────────────────────────────────────
// Global TypeScript interfaces and types
// Used across all features, services, and hooks
// ─────────────────────────────────────────────

export interface TravelEntry {
  id: string;        // UUID via react-native-uuid
  imageUri: string;  // Local file URI from camera
  address: string;   // Reverse-geocoded address string
  createdAt: string; // ISO date string
}

// Strict navigation param list for type-safe routing
export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

// Theme shape consumed by ThemeContext and all themed components
export interface AppTheme {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    subText: string;
    border: string;
    primary: string;
    danger: string;
    buttonText: string;
  };
}
