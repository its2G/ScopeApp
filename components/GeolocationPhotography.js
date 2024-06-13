import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase'
import * as ImagePicker from 'expo-image-picker';



export default function App() {

    const [photoUri, setPhotoUri] = useState(""); // State to store the photo URI
    const [pin, setPin] = React.useState({
      latitude: 51.47271,
      longitude: -0.032755,
    });
    
const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);
    

    //using my current location to track 
    React.useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
  
        setPin({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        });
      })();
    }, []);



    const openCamera = async () => {
      try {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
          console.log('Camera permission not granted');
          
          return;
        }
    
        const response = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          exif: true,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });
    
        if (response.cancelled) {
          console.log('Camera usage was cancelled');
          return;
        }
    
        if (response.assets && latitude && longitude) {
          const image = response.assets[0];
          const fileExt = image.uri.split('.').pop().toLowerCase() ?? 'jpeg';
          const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
          const path = `${Date.now()}.${fileExt}`;
    
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(path, arraybuffer, {
              contentType: 'image/png', // Make sure this matches the actual image format
            });

            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              return;
            } else {
              console.log('Upload success:', uploadData);
              // console.log('Upload success, file key:', uploadData.Key);

            }
    
          // if (image.uri) {
          //   console.log('Image URI: ', image.uri);
          //   setPhotoUri(image.uri); // Update the state with the new image URI

      


          const { data: signedData, error: signedUrlError } = await supabase
          .storage
          .from('avatars')
          .createSignedUrl(path, 60 * 60 * 24); // The URL is valid for 24 hours
      
      if (signedUrlError) {
          console.error('Error creating signed URL:', signedUrlError);
          return;
      }
      const signedUrl = signedData.signedURL;

            // console.log('Uploaded file key:', uploadData.Key);
// console.log('Image URL:', imageUrl);
          console.log('Supabase Response:', uploadData);
            // console.log('Signed URL:', signedURL);
            console.log('EXIF Data:', image.exif);
  



    
            const { data: dbData, error: dbError } = await supabase
                .from('image_locations')
                .insert([
                    { signedUrl, latitude, longitude  }
                ]);
        
                console.log('Inserting data:', { uri: signedUrl, latitude: image.exif.Latitude, longitude: image.exif.Longitude });
 
                console.log(location);

                if (dbError) {
                  console.error('Error saving image data to database:', dbError);
                } else {
                  console.log('Image data saved successfully to the database', dbData);
                  // Update the pin location on the map
                  setPin({
                    latitude,
                    longitude,
                  });
                }
              
            
            
            
          
        }
      } catch (error) {
        console.error('An error occurred while opening the camera:', error);
      }
    };
    

  
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 51.472713,
            longitude: -0.032755,
            latitudeDelta: 0.0500,
            longitudeDelta: 0.0500,
          }}
          showsUserLocation={true}
          onUserLocationChange={(e) => {
            // console.log('onUserLocationChange', e.nativeEvent.coordinate);
  
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
        >
  {photoUri && (
    <Marker coordinate={pin}>
      <Image source={{ uri: photoUri }} style={styles.thumbnail} />
    </Marker>
  )}
  
  
          {/* <Marker
            coordinate={pin}
            pinColor="gold"
            draggable={true}
            onDragStart={(e) => {
              console.log('Drag Start', e.nativeEvent.coordinate);
            }}
            onDragEnd={(e) => {
              console.log('Drag End', e.nativeEvent.coordinate);
  
              setPin({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          >
            <Callout>
              <Text>This is a Callout</Text>
            </Callout>
          </Marker> */}
  
          <Circle center={pin} radius={100} />
        </MapView>

        <TouchableOpacity style={styles.custombutton} onPress={openCamera}>
    <Text style={{ color: 'white' }}>Open Camera</Text>
  </TouchableOpacity>
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
    thumbnail: {
      width: 100,
      height: 100,
    },
    custombutton: {
      position: 'absolute',
      right: 10,
      top: 50,
      backgroundColor: 'blue',
      padding: 20,
      borderRadius: 5,
    },
  }); 