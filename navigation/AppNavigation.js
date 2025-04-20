// navigation/AppNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import SwipeScreen from '../screens/SwipeScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Swipe" component={SwipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;