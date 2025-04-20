// App.js
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { supabase } from './components/Supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

import Auth from './components/Auth';
import MapScreen from './screens/MapScreen';
import CameraScreen from './screens/CameraScreen';
import SwipeScreen from './screens/SwipeScreen';

import AppNavigation from './navigation/AppNavigation';
import MapView from 'react-native-maps';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  
    return () => listener.subscription?.unsubscribe();
  }, []);
  
  if (loading) return null; // Or show splash screen
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {session && session.user ? (
        <AppNavigation /> // Use AppNavigation if user is authenticated
      ) : (
        <Auth />
      )}
    </GestureHandlerRootView>
  );
}
