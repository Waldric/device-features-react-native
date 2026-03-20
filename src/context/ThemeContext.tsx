// ─────────────────────────────────────────────
// ThemeContext — global dark/light mode state
// Wrap app root with ThemeProvider once in App.tsx
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

const ThemeContext = createContext<ThemeContextValue>({
  theme: { dark: false, colors: LIGHT_COLORS },
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const theme: AppTheme = {
    dark:   isDark,
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
