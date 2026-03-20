import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface PermissionRationaleProps {
  icon:        'location'      | 'notifications';
  title:       string;
  description: string;
  buttonLabel: string;
  onPress:     () => void;
}

const PermissionRationale: React.FC<PermissionRationaleProps> = ({
  icon,
  title,
  description,
  buttonLabel,
  onPress,
}) => {
  const { theme } = useTheme();

  const iconName = icon === 'location'
    ? 'location-outline'
    : 'notifications-outline';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.dark
            ? 'rgba(40, 40, 45, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: theme.dark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* Icon */}
      <Ionicons
        name={iconName}
        size={28}
        color={theme.colors.primary}
        style={styles.icon}
      />

      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>

      {/* Description with bold key phrase */}
      <Text style={[styles.description, { color: theme.colors.subText }]}>
        {description}
      </Text>

      {/* Action button */}
      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius:  16,
    borderWidth:   1,
    padding:       20,
    alignItems:    'center',
    gap:           10,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.08,
    shadowRadius:   12,
    elevation:      4,
  },
  icon: {
    marginBottom: 4,
  },
  title: {
    fontFamily:  'Inter_600SemiBold',
    fontSize:    16,
    textAlign:   'center',
    letterSpacing: -0.2,
  },
  description: {
    fontFamily:  'Inter_400Regular',
    fontSize:    14,
    textAlign:   'center',
    lineHeight:  22,
  },
  button: {
    width:           '100%',
    paddingVertical: 14,
    borderRadius:    32,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       6,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   15,
    color:      '#FFFFFF',
  },
});

export default PermissionRationale;