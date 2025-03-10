import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Pressable, Text } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function App() {
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
    if (!camera.current) return;
    const photo = await camera.current.takePhoto();
    setPhoto(photo);
    console.log("Photo captured:", photo.path);
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

      {/* Capture Buttons */}
      <View style={styles.controls}>
        <Pressable onPress={onTakePicture} style={styles.captureButton}>
          <Text style={styles.buttonText}>📷 Capture</Text>
        </Pressable>
        <Pressable onPress={isRecording ? onStopRecording : onStartRecording} style={[styles.captureButton, { backgroundColor: isRecording ? 'red' : 'white' }]}>
          <Text style={styles.buttonText}>{isRecording ? '⏹ Stop' : '🎥 Record'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
