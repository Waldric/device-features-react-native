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
          contentStyle: { backgroundColor: theme.colors.background },
          animation:    'slide_from_right',
        }}
      >
        {/* Home  */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* AddEntry*/}
        <Stack.Screen
          name="AddEntry"
          component={AddEntryScreen}
          options={{
            headerShown:         true,
            title:               '',
            headerStyle:         { backgroundColor: theme.colors.background },
            headerShadowVisible: false,
            headerTintColor:     theme.colors.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;