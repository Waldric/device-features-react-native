// ─────────────────────────────────────────────
// ThemedView — base screen wrapper
// Automatically applies background color from
// the active theme so screens don't repeat this
// ─────────────────────────────────────────────

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

const ThemedView: React.FC<ThemedViewProps> = ({ children, style, ...rest }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemedView;