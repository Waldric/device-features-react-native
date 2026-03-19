// ─────────────────────────────────────────────
// Global TypeScript interfaces and types
// Used across all features, services, and hooks
// ─────────────────────────────────────────────

export interface TravelEntry {
  id: string;           // Unique identifier (timestamp-based UUID)
  imageUri: string;     // Local file URI from camera
  address: string;      // Reverse-geocoded human-readable address
  createdAt: string;    // ISO date string for display/sorting
}

// Navigation param list — keeps navigation strictly typed
export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

// Theme shape used by ThemeContext and all themed components
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