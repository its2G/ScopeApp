import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from '../screens/CameraScreen';
// import SwipeScreen from '../screens/SwipeScreen';
// import MapScreen from '../screens/MapScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} />
        {/* <Stack.Screen name="Swipe" component={SwipeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;