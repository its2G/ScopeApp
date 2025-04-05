import React, { useEffect } from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { supabase } from '../components/Supabase';

const SwipeScreen = () => {
const [images, setImages] = React.useState(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState(null);


useEffect(() => {
const DisplayAnImage = async () => {
try{
  setLoading(true);
  const { data, error } = await supabase
    .from('photos')
    .select('url')
    .eq('id', 10); // Replace with the actual ID of the photo you want to display


    console.log("Supabase response:", data, error);

  if (error) throw error;
  setImages(data);
} catch (err) { 
  setError(err.message);
  console.error('Error fetching image:', err);
} finally {
  setLoading(false);
}
};

DisplayAnImage();
}, []);
    


return (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text> // Show loading message
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text> // Show error message
      ) : images ? (
        <Image
  style={styles.image}
  source={{ uri: images[0].url }}
/>
      ) : (
        <Text>No image available</Text> // Handle case where no image is found
      )}
    </SafeAreaView>
  </SafeAreaProvider>
  );
};

export default SwipeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    },
  });