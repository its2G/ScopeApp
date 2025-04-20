import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { supabase } from '../components/Supabase.js';

const GEOFENCE_TASK = 'geofence-task';

TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Geofencing Error:", error);
    return;
  }

  if (data) {
    const { eventType, region } = data;
    console.log("Geofencing event:", eventType, region);

    if (eventType === Location.GeofencingEventType.Enter) {
      DeviceEventEmitter.emit('regionEntered', region);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Geofence Alert",
          body: `You've entered ${region.identifier}`,
        },
        trigger: null,
      });
    } else if (eventType === Location.GeofencingEventType.Exit) {
      DeviceEventEmitter.emit('regionExited', region);
    }
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function MapScreen({navigation}) {
  const [regions, setRegions] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);
  const regionsRef = useRef([]);

  useEffect(() => {
    const loadRegions = async () => {
      const { data, error } = await supabase.from('regions').select('*');
      if (error) {
        console.error("Error fetching regions:", error.message);
        return;
      }
      setRegions(data);
      regionsRef.current = data;

      // Slight delay to ensure everything is ready before starting geofencing
      await new Promise(res => setTimeout(res, 500));

      await Location.startGeofencingAsync(
        GEOFENCE_TASK,
        data.map(region => ({
          identifier: region.identifier,
          latitude: region.latitude,
          longitude: region.longitude,
          radius: region.radius,
        }))
      );
    };

    loadRegions();
  }, []);

  useEffect(() => {
    const setupPermissions = async () => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        console.log("Foreground location permission not granted.");
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.log("Background location permission not granted.");
        return;
      }

      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        console.log("Notification permission not granted.");
        return;
      }

      console.log("Permissions granted and setup complete");
    };

    setupPermissions();
  }, []);

  useEffect(() => {
    const enterListener = DeviceEventEmitter.addListener('regionEntered', (incomingRegion) => {
      console.log('Entered region:', incomingRegion);
      const matched = regionsRef.current.find(r => r.identifier === incomingRegion.identifier);
      if (matched) {
        console.log('Matched region from Supabase:', matched);
        setActiveRegion(matched);
      } else {
        console.log('Region not found in Supabase:', incomingRegion.identifier);
      }
    });

    const exitListener = DeviceEventEmitter.addListener('regionExited', (incomingRegion) => {
      console.log('Exited region:', incomingRegion);
      setActiveRegion(null);
    });

    return () => {
      enterListener.remove();
      exitListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 51.5007,
          longitude: -0.1246,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {regions.map((region) => (
          <React.Fragment key={region.identifier}>
            <Circle
              center={{ latitude: region.latitude, longitude: region.longitude }}
              radius={region.radius}
              strokeColor="rgba(0,0,255,0.5)"
              fillColor="rgba(0,0,255,0.2)"
            />
            <Marker
              coordinate={{ latitude: region.latitude, longitude: region.longitude }}
              title={region.name || region.identifier}
              description={`Geofence: ${region.name || region.identifier}`}
            />
          </React.Fragment>
        ))}
      </MapView>

      {activeRegion && (
        <View style={styles.cameraButtonWrapper}>
          <Text style={styles.infoText}>You're in {activeRegion.identifier}</Text>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              console.log('Navigating with region:', activeRegion);
              console.log('Navigating to CameraScreen with regionId:', activeRegion.regionID);
              navigation.navigate('Camera', { regionId: activeRegion.regionID });
            }}
          >
            <Text style={styles.cameraButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {!activeRegion && (
        <Text style={styles.infoText}>Walk into a blue zone to take photos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoText: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
  },
  cameraButtonWrapper: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
