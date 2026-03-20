// ─────────────────────────────────────────────
// AppNavigator — React Navigation stack setup
// Kept here so App.tsx stays minimal
// ─────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import HomeScreen     from '../features/home/HomeScreen';
import AddEntryScreen from '../features/addEntry/AddEntryScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle:      { backgroundColor: theme.colors.card },
          headerTintColor:  theme.colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle:     { backgroundColor: theme.colors.background },
          animation:        'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '✈️ Travel Diary' }}
        />
        <Stack.Screen
          name="AddEntry"
          component={AddEntryScreen}
          options={{ title: 'New Entry' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
