// ─────────────────────────────────────────────
// App.tsx — entry point, kept intentionally minimal
// Only responsibility: wrap with ThemeProvider
// and register notifications on startup
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