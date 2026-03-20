// ─────────────────────────────────────────────
// App.tsx — entry point, intentionally minimal
// Responsibilities:
//   1. Wrap app with ThemeProvider
//   2. Register notifications on startup
//   3. Mount AppNavigator
// All other logic lives in features/hooks/services
// ─────────────────────────────────────────────

import React, { useEffect } from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForNotifications } from './src/services/notificationService';

export default function App() {
  // Register notification channel + permissions once at startup
  useEffect(() => {
    registerForNotifications();
  }, []);

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
