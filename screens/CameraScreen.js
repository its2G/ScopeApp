// filepath: g:\CODINGWORK\202324Y3CC\FinalProject\Projects\expophotography\screens\CameraScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Pressable, Text } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { supabase } from '../components/Supabase.js';


// import axios from 'axios';

const CameraScreen = ({ navigation, route }) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) return <ActivityIndicator />;
  if (!device) return <Text>Camera device not found</Text>;

  const onTakePicture = async () => {

    try {
      const { regionId } = route.params;
  
      if (!regionId) {
        console.error('Missing regionId in route params');
        return;
      }
    
    if (!camera.current) return;
    const photo = await camera.current.takePhoto();

    setPhoto(photo);
    const newPath = `${RNFS.DocumentDirectoryPath}/photo.jpg`; // Use a valid path
    await RNFS.moveFile(photo.path, newPath);
    console.log("Updated Photo URI:", newPath);
    console.log("Photo captured:", photo.path);



    
  const formData = new FormData();
  formData.append('photo', {
    uri: `file://${newPath}`, // Ensure the correct URI format
    type: 'image/jpeg',
    name: 'photo.jpg',
  });

  

  const response = await fetch('https://562b-82-7-110-137.ngrok-free.app/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },
  });

  console.log("FormData for upload:", formData);



  const data = await response.json();
  console.log('Response for PhotoURL:', data.photoUrl);

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return;
  }


  // Save the photo URL to Supabase
  const { data: insertData, error } = await supabase
  .from('photos') // Replace 'photos' with your actual table name
  .insert([{ 
      url: data.photoUrl,
      region_id: regionId,
      user_id: user.id, // Assuming you have a user_id column in your table
     }]) // Adjust the column names as per your table structure
  .select()


  if (error) {
    console.error('Error saving photo to Supabase:', error);
  } else {
    console.log('Photo saved to Supabase:', insertData[0]);
  }

} catch (error) {
  console.error('onTakePicture error:', error);
}

  };

  const onStartRecording = async () => {
    if (!camera.current) return;
    setIsRecording(true);
    camera.current.startRecording({
      onRecordingFinished: (video) => {
        setIsRecording(false);
        setVideo(video);
        console.log("Video saved at:", video.path);
      },
      onRecordingError: (error) => {
        console.error(error);
        setIsRecording(false);
      },
    });
  };

  const onStopRecording = () => {
    camera.current?.stopRecording();
  };

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo video audio />

      <View style={styles.controls}>
        <Pressable onPress={onTakePicture} style={styles.captureButton}>
          <Text style={styles.buttonText}>📷 Capture</Text>
        </Pressable>
        <Pressable onPress={isRecording ? onStopRecording : onStartRecording} style={[styles.captureButton, { backgroundColor: isRecording ? 'red' : 'white' }]}>
          <Text style={styles.buttonText}>{isRecording ? '⏹ Stop' : '🎥 Record'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Map')} style={styles.captureButton}>
          <Text style={styles.buttonText}>Go to Map</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Swipe')} style={styles.captureButton}>
          <Text style={styles.buttonText}>Go to Swipe</Text>
        </Pressable>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  captureButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
