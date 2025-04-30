import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, DeviceEventEmitter,
  Button, Modal, ScrollView, Image, Pressable, Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { supabase } from '../components/Supabase';

const GEOFENCE_TASK = 'geofence-task';

// Geofence background task
TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Geofencing Error:", error);
    return;
  }

  if (data) {
    const { eventType, region } = data;
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

// PhotoGallery Component
const PhotoGalleryOverlay = ({ visible, regionId, onClose }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('region_id', regionId);

      if (error) {
        console.error("Error fetching photos:", error.message);
      } else {
        setPhotos(data);
      }
    };

    if (visible && regionId) {
      fetchPhotos();
    }
  }, [visible, regionId]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlayContainer}>
        <ScrollView>
          {photos.map(photo => (
            <Image key={photo.id} source={{ uri: photo.url }} style={styles.photo} />
          ))}
        </ScrollView>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default function MapScreen({ navigation }) {
  const [regions, setRegions] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const regionsRef = useRef([]);


  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign Out Error', error.message);
    } else {
      console.log("Signed out successfully");
      // App.js will automatically switch to the Auth screen
    }
  };

  function detectRegion(coords, regions, setActiveRegion) {
    const { latitude, longitude } = coords;
    let found = null;
  
    for (let r of regions) {
      const dist =
        Math.hypot(
          (latitude  - r.latitude)  * 111000,
          (longitude - r.longitude) * 111000
        );
      if (dist <= r.radius) {
        found = r;
        break;
      }
    }
  
    setActiveRegion(found);
  }
  

  
  useEffect(() => {
    let watchSub;
  
    (async () => {
      // A) Request permissions in sequence
      const { status: fg } = await Location.requestForegroundPermissionsAsync();
      if (fg !== 'granted') {
        Alert.alert('Permission required', 'Allow location while using the app');
        return;
      }
      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      if (bg !== 'granted') {
        Alert.alert(
          'Background location required',
          'Go to Settings → ExpoPhotography → Location → Always'
        );
        return;
      }
      await Notifications.requestPermissionsAsync();
  
      // B) Fetch regions & start background geofencing
      const { data, error } = await supabase.from('regions').select('*');
      if (error) {
        console.error(error);
        return;
      }
      setRegions(data);
      regionsRef.current = data;
      await Location.startGeofencingAsync(
        GEOFENCE_TASK,
        data.map(r => ({
          identifier: r.identifier,
          latitude:   r.latitude,
          longitude:  r.longitude,
          radius:     r.radius,
        }))
      );
  
      const { coords } = await Location.getCurrentPositionAsync();
      detectRegion(coords, data, setActiveRegion);
  
      watchSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 10 },
        ({ coords }) => detectRegion(coords, regionsRef.current, setActiveRegion)
      );
    })();
  
    return () => {
      if (watchSub) watchSub.remove();
    };
  }, []);
  // Handle geofence enter/exit
  useEffect(() => {
    const enterListener = DeviceEventEmitter.addListener('regionEntered', (incomingRegion) => {
      const matched = regionsRef.current.find(r => r.identifier === incomingRegion.identifier);
      if (matched) setActiveRegion(matched);
    });

    const exitListener = DeviceEventEmitter.addListener('regionExited', () => {
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
        showsUserLocation
      >



        {regions.map(region => (
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
              onPress={() => {
                setSelectedRegionId(region.regionID);
                setOverlayVisible(true);
              }}
            />
          </React.Fragment>
        ))}
      </MapView>
      <View style={styles.signOutButtonWrapper}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>



    <View style={styles.LeaderBoardButtonWrapper}>
        <Pressable onPress={() => navigation.navigate('Leaderboard')} 
          style={styles.leaderboardButton}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </Pressable>
    </View>

      <PhotoGalleryOverlay
        visible={isOverlayVisible}
        regionId={selectedRegionId}
        onClose={() => setOverlayVisible(false)}
      />

      {activeRegion && (
        <>
        <View style={styles.swipeButtonWrapper}>
        <Pressable onPress={() => navigation.navigate('Swipe', { regionId: activeRegion.regionID })} 
          style={styles.captureButton}>
          <Text style={styles.buttonText}>Go to Swipe</Text>
        </Pressable>
        </View>



        <View style={styles.cameraButtonWrapper}>
          <Text style={styles.infoText}>You're in {activeRegion.identifier}</Text>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              navigation.navigate('Camera', { regionId: activeRegion.regionID });
            }}
          >
            <Text style={styles.cameraButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
        </View>
        </>
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
  overlayContainer: {
    position: 'absolute',
    bottom: 50,
    height: '75%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  photo: {
    width: '100%',
    height: 500,
    marginBottom: 10,
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
  swipeButtonWrapper: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    alignItems: 'center',
  },
  signOutButtonWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    top : 50,
  },
  LeaderBoardButtonWrapper: {
    position: 'absolute',
    top: 50, // Adjust the vertical position
    right: 25, // Align the button to the right of the screen
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  leaderboardButton: {
    padding: 2,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
