import React, { useEffect } from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import Swiper from "react-native-deck-swiper";
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
const onSwiped = () => {
  setIndex(index + 1);
};

const handleSwipe = async (index,liked) => {
  const swipedCard = images[index];
  

  await supabase.from('swipes').insert({
    photo_id: swipedCard.url,
    liked: liked,
    created_at: new Date()
  }); 

  // console.log(`User ${liked ? 'liked' : 'disliked'} photo`, swipedCard.url);
  console.log("Swiped card:", swipedCard);

};

// const { data: swipedData, error: swipedError } = await supabase
//   .from('swipes')
//   .select('*')
//   .eq('user_id', userId); // Replace with actual user ID

//   const swipedPhotoIds = swipedData.map((row)) => row.photo_id;

  



useEffect(() => {
const DisplayAnImage = async () => {
try{
  setLoading(true);
  const { data, error } = await supabase
    .from('photos')
    .select('url')
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

// Loading, error, and empty image states
if (loading) {
  return <Text>Loading...</Text>;
}

if (error) {
  return <Text style={{ color: 'red' }}>Error: {error}</Text>;
}

if (!images || images.length === 0) {
  return <Text>No images available</Text>;
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