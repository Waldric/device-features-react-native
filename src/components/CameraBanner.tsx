import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { openCameraSettings } from '../services/cameraService';

const CameraBanner: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.dark
            ? 'rgba(220,53,53,0.15)'
            : 'rgba(220,53,53,0.08)',
          borderColor: theme.dark
            ? 'rgba(220,53,53,0.4)'
            : 'rgba(220,53,53,0.25)',
        },
      ]}
    >
      <Ionicons
        name="camera-outline"
        size={18}
        color="#E53935"
        style={styles.icon}
      />
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Camera access denied
        </Text>
        <Text style={[styles.sub, { color: theme.colors.subText }]}>
          Enable camera access in your device settings to take photos.
        </Text>
      </View>
      <Pressable
        onPress={openCameraSettings}
        style={styles.settingsBtn}
        accessibilityRole="button"
        accessibilityLabel="Open settings to grant camera permission"
      >
        <Text style={styles.settingsBtnText}>Settings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection:     'row',
    alignItems:        'center',
    borderRadius:      12,
    borderWidth:       1,
    paddingVertical:   12,
    paddingHorizontal: 14,
    gap:               10,
    marginTop:         -8, 
  },
  icon: {
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    gap:  2,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   13,
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize:   12,
    lineHeight: 17,
  },
  settingsBtn: {
    flexShrink:        0,
    paddingVertical:   6,
    paddingHorizontal: 12,
    borderRadius:      16,
    backgroundColor:   '#E53935',
  },
  settingsBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   12,
    color:      '#FFFFFF',
  },
});

export default CameraBanner;