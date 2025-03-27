import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle  } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications'; 
import { supabase } from '../components/Supabase.js';


// start //  


// Function to insert data when entering a geofenced area
async function enterGeofencedArea(personId, areaId) {
  try {
    const { data, error } = await supabase
      .from('area_entities')
      .insert([
        {
          person_id: personId,
          area_id: areaId,
          is_in_area: true,
        },
      ]);

    if (error) {
      console.error(error);
    } else {
      console.log('Entered geofenced area:', data);
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to update data when leaving a geofenced area
async function leaveGeofencedArea(personId, areaId) {
  try {
    const { data, error } = await supabase
      .from('area_entities')
      .update([
        {
          person_id: personId,
          area_id: areaId,
          is_in_area: false,
          left_at: new Date().toISOString(),
        },
      ])
      .eq('person_id', personId)
      .eq('area_id', areaId)
      .eq('is_in_area', true);

    if (error) {
      console.error(error);
    } else {
      console.log('Left geofenced area:', data);
    }
  } catch (error) {
    console.error(error);
  }
}

const personId = '550e8400-e29b-41d4-a716-446655440000'; // Replace with a valid UUID
const areaId = '123e4567-e89b-12d3-a456-426614174000';   // Replace with a valid UUID

// END // //////////////////////////////////////////////////////////////

const GEOFENCE_TASK = 'geofence-task';

TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Geofencing Error:", error);
    return;
  }


  if (data) {
    console.log("Geofencing Data Received:", data); // Log the data to confirm the task is triggered
    const { eventType, region } = data;
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log(`Entered the region: ${region.identifier}`);

      enterGeofencedArea(personId, areaId);


      //Triggering notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Geofence Alert",
          body: `Entering the ${region.identifier} area.`,
        },
        trigger: null,
      });
      console.log("Notification scheduled"); // Log to confirm the notification is scheduled
    } else if (eventType === Location.GeofencingEventType.Exit) {
      leaveGeofencedArea(personId, areaId);
      console.log(`Exited the region: ${region.identifier}`);
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

const region = {
  identifier: 'BigBen',
  latitude: 51.572192,
  
  longitude: -0.412941,
  radius: 10,
};





export default function App() {
  useEffect(() => {
    const requestPermissionsAndSetup = async () => {
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

    // Request notification permissions
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    if (notificationStatus !== 'granted') {
      console.log("Notification permission not granted.");
      return;
    }

      await Location.startGeofencingAsync(GEOFENCE_TASK, [region]);
      console.log("Geofencing started");

  const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK);
  console.log("Is Geofencing Task Registered?", isTaskRegistered);
      
    };

    

    requestPermissionsAndSetup();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE} // Add the provider property
        initialRegion={{
          latitude: 51.5007,
          longitude: -0.1246,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        <Circle center={region} radius={region.radius} strokeColor="rgba(0,0,255,0.adb5)" fillColor="rgba(0,0,255,0.2)" />
      </MapView>
      <Text style={styles.infoText}>Geofencing enabled for Big Ben</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: 500,
    height: 1000,
  },
  infoText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
  },
});
