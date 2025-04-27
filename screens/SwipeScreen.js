import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import Swiper from "react-native-deck-swiper";
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../components/Supabase';
import {MaterialCommunirtyIcons, MaterialCommunityIcons} from '@expo/vector-icons';

const colors = {
  red: '#EC2379',
  blue: '#0070FF',
  gray: '#777777',
  white: '#ffffff',
  black: '#000000',
  green: '#19e409',
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
const swiperRef = React.useRef(null);
const navigation = useNavigation();




const onSwiped = () => {
  setIndex(index + 1);
};

const handleSwipe = async (index, liked) => {
  if (!images || !images[index]) {
    console.log('No photo available to swipe.');
    return; 
  }

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

               
return (
  <View style={styles.container}>
    <View style={styles.topBar}>
      <MaterialCommunityIcons.Button
        name="arrow-left"
        backgroundColor="transparent"
        underlayColor="transparent"
        activeOpacity={0.5}
        color="black"
        size={30}
        onPress={() => navigation.goBack()}
      />
    </View>

    {loading ? (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    ) : error ? (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    ) : !images || images.length === 0 || index >= images.length ? (
      <View style={styles.center}>
        <Text style={styles.noMoreCardsText}>You've seen all the photos!</Text>
        <Text style={styles.noMoreCardsSubtext}>Check back later for new photos 😉</Text>
      </View>
    ) : (
      <>
        <View style={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            cards={images}
            cardIndex={index}
            renderCard={card => card ? <Card key={card.id} card={card} /> : null}
            onSwipedLeft={i => handleSwipe(i, false)}
            onSwipedRight={i => handleSwipe(i, true)}
            onSwiped={onSwiped}
            stackSize={4}
            stackScale={10}
            stackSeparation={14}
            disableBottomSwipe
            disableTopSwipe
            animateCardOpacity
            animateOverlayLabelsOpacity
            backgroundColor="transparent"
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: colors.red,
                    borderColor: colors.red,
                    color: colors.white,
                    borderWidth: 1,
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginLeft: -20,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: colors.blue,
                    borderColor: colors.blue,
                    color: colors.white,
                    borderWidth: 1,
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginLeft: 20,
                  },
                },
              },
            }}
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.bottomContainerButtons}>
            <MaterialCommunityIcons.Button
              name="close"
              size={94}
              backgroundColor="transparent"
              underlayColor="transparent"
              activeOpacity={0.3}
              color={colors.red}
              onPress={() => swiperRef.current?.swipeLeft()}
              disabled={!images || index >= images.length}
            />
            <MaterialCommunityIcons.Button
              name="circle-outline"
              size={94}
              backgroundColor="transparent"
              underlayColor="transparent"
              activeOpacity={0.3}
              color={colors.green}
              onPress={() => swiperRef.current?.swipeRight()}
              disabled={!images || index >= images.length}
            />
          </View>
        </View>
      </>
    )}
  </View>
);
};

export default SwipeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperContainer: {
    flex: 0.55
  },
  bottomContainer: {
    flex: 0.45,
    justifyContent: 'space-evenly'
  },
  center: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
noMoreCardsText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: colors.black,
  marginBottom: 10,
},
topBar: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  padding: 10,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
},
noMoreCardsSubtext: {
  fontSize: 16,
  color: colors.gray,
  textAlign: 'center',
},
  bottomContainerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
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
    width: 350,
    flex: 1,
    resizeMode: 'contain'
  },
  card: {
    flex: 0.65,
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