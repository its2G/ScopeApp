import React, { useEffect } from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import Swiper from "react-native-deck-swiper";
import { useRoute } from '@react-navigation/native';
import { supabase } from '../components/Supabase';

const colors = {
  red: '#EC2379',
  blue: '#0070FF',
  gray: '#777777',
  white: '#ffffff',
  black: '#000000'
};

const Card = ({ card }) => (
  <View style={styles.card}>
    <Image source={{ uri: card.url }} style={styles.cardImage} />
    </View>
)

const SwipeScreen = () => {
const [images, setImages] = React.useState(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState(null);
const [index, setIndex] = React.useState(0);
const route = useRoute();



const onSwiped = () => {
  setIndex(index + 1);
};

const handleSwipe = async (index, liked) => {
  try {
    const swipedCard = images[index];
    console.log("Attempting to save swipe for:", swipedCard.url);
    console.log("Attempting to save swipe for:", swipedCard.id);


  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return;
  }


    // this inserts a new row into the swipes table // 
    const { data, error } = await supabase.from('swipes').insert({
      photo_URL: swipedCard.url,
      photo_ID: swipedCard.id,
      user_id: user.id,
      liked: liked,
      created_at: new Date()
    });
    
    if (error) throw error;
    
    console.log("Swipe saved successfully:", data);
  } catch (err) {
    console.error("Failed to save swipe:", err.message);
    setError("Failed to save swipe: " + err.message);
  }
};



useEffect(() => {
  const DisplayAnImage = async () => {
    try{
      setLoading(true);


      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        return;
      }

      const {data: swipes, error: swipeError} = await supabase
        .from('swipes')
        .select('photo_ID')
        .eq('user_id', user.id) // Assuming you have a user_id column in your swipes table
      
    
        if (swipeError) throw swipeError;


      // making sure that the photos do not appear again in the swiping screen // 
      const swipedPhotoIds = swipes.map((s) => s.photo_ID);
    const { regionId } = route.params; // Get the regionId from the route params
     // Start building photo query
      let photoQuery = supabase
        .from('photos')
        .select('url, id')
        .eq('region_id', regionId);

      // Only exclude photos if the user has swiped on any
      if (swipedPhotoIds.length > 0) {
        photoQuery = photoQuery.filter('id', 'not.in', `(${swipedPhotoIds.join(',')})`);
      }

      const { data, error } = await photoQuery;

      if (error) throw error;

      // inserted the data into the images state // 
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

// Loading, error, and empty image states
if (loading) {
  return <Text>Loading...</Text>;
}

if (error) {
  return <Text style={{ color: 'red' }}>Error: {error}</Text>;
}

if (!images || !Array.isArray(images) || images.length === 0) {
  return <Text style={{ textAlign: 'center', marginTop: 100 }}>No photos to swipe on</Text>;
}
                           
return (
  <View style ={styles.container}>
    <Swiper
      cards={images}
      cardIndex={index}
      renderCard={card => <Card card={card} />}
      onSwipedLeft={(index) => handleSwipe(index, false)}   
      onSwipedRight={(index) => handleSwipe(index, true)}
      onSwiped={onSwiped}
      stackSize={4}
      stackScale={10}
      stackSeparation={14}
      disableBottomSwipe
      disableTopSwipe
      
    />
  </View>
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
    cardImage: {
    width: 160,
    flex: 1,
    resizeMode: 'contain'
  },
  card: {
    flex: 0.45,
    borderRadius: 8,
    shadowRadius: 25,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  });