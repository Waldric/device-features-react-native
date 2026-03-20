import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme } from '../types';
import { LIGHT_COLORS, DARK_COLORS } from '../constants';

// AsyncStorage key for theme preference
const THEME_KEY = '@theme_preference';

interface ThemeContextValue {
  theme:       AppTheme;
  toggleTheme: () => void;
  showToast:   (message: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:       { dark: false, colors: LIGHT_COLORS },
  toggleTheme: () => {},
  showToast:   () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark,       setIsDark]       = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim  = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theme: AppTheme = {
    dark:   isDark,
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved !== null) setIsDark(saved === 'dark');
      } catch (e) {
        console.error('[ThemeContext] Failed to load theme preference:', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch (e) {
      console.error('[ThemeContext] Failed to save theme preference:', e);
    }
  }, [isDark]);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToastMessage(message);
    setToastVisible(true);

    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue:         1,
        duration:        250,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastAnim, {
        toValue:         0,
        duration:        300,
        useNativeDriver: true,
      }),
    ]).start(() => setToastVisible(false));

    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }, [toastAnim]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, showToast }}>
      {children}

      {/* Global toast — rendered above everything */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#1A1A1A',
              opacity: toastAnim,
              transform: [{
                translateY: toastAnim.interpolate({
                  inputRange:  [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

const styles = StyleSheet.create({
  toast: {
    position:          'absolute',
    bottom:            Platform.OS === 'ios' ? 100 : 80,
    alignSelf:         'center',
    paddingVertical:   12,
    paddingHorizontal: 24,
    borderRadius:      24,
    maxWidth:          '80%',
    elevation:         10,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 4 },
    shadowOpacity:     0.25,
    shadowRadius:      8,
    zIndex:            9999,
  },
  toastText: {
    color:      '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize:   14,
    textAlign:  'center',
  },
});