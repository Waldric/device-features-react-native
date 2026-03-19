// ─────────────────────────────────────────────
// ThemeContext — provides dark/light mode state
// Consumed via useTheme() hook across all screens
// ─────────────────────────────────────────────

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from 'react';
import { AppTheme } from '../types';
import { LIGHT_COLORS, DARK_COLORS } from '../constants';

interface ThemeContextValue {
  theme: AppTheme;
  toggleTheme: () => void;
}

// Default to light theme on first render
const ThemeContext = createContext<ThemeContextValue>({
  theme: { dark: false, colors: LIGHT_COLORS },
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const theme: AppTheme = {
    dark: isDark,
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
  };

  // Toggle between dark and light mode
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Convenience export — avoids importing useContext everywhere
export const useThemeContext = () => useContext(ThemeContext);