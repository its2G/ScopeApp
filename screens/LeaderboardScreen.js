// LeaderboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, ScrollView} from 'react-native';
import { supabase } from '../components/Supabase';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // make sure correct import



export default function LeaderboardScreen({ navigation }) {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);


  // Load the leaderboard when regionId changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedRegionId) return;
      setLoading(true);

      const { data, error } = await supabase.rpc('fetch_leaderboard', {
        regionid: selectedRegionId });

      if (error) {
        console.error("Error fetching leaderboard:", error.message);
      } else {
        setLeaderboard(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [selectedRegionId]);

  return (
<SafeAreaView style={styles.container}>
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
      <Text style={styles.title}>🏆 Leaderboard</Text>


      {!selectedRegionId && (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20}}>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('9d293fbd-fb2d-42ce-b377-4968bbdf2c21')} style={styles.regionButton}>
        <Text>Region 1 - Goldsmiths, University of London</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('2dcc2811-b127-44cf-ba93-14aa12724df1')} style={styles.regionButton}>
        <Text>Region 2 - Big Ben</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('7128572a-5660-4073-8712-624765a06d51')} style={styles.regionButton}>
        <Text>Region 3 - Battersea Park</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('ea6d2d75-eec0-45ed-ad5d-9943beab5182')} style={styles.regionButton}>
        <Text>Region 4 - Buckingham Palace</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('454dfc91-cc74-43ee-995b-ca3e20f515d3')} style={styles.regionButton}>
        <Text>Region 6 - St James Hatcham Building</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('fdd3c520-cf75-4274-8c19-4de8a6c3922b')} style={styles.regionButton}>
        <Text>Region 7 - Northala Fields</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('fa601ee5-67bb-44b1-b5c1-7db3ebb812e9')} style={styles.regionButton}>
        <Text>Region 8 - Telegraph Hill Upper Park</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setSelectedRegionId('6bb2e40b-fbb0-422b-ba69-6c88a16875cf')} style={styles.regionButton}>
        <Text>Region 9 - Fordham Park, Deptford</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
)}


    {selectedRegionId && (
  <View style={{ alignItems: 'center', marginVertical: 10 }}>
    <TouchableOpacity
      onPress={() => setSelectedRegionId(null)}
      style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 10 }}
    >
      <Text style={{ fontWeight: 'bold' }}>🔙 Back to Region Selection</Text>
    </TouchableOpacity>
  </View>
)}
  

      {/* Show loading */}
      {loading && <Text>Loading...</Text>}

      {selectedRegionId && (
  <FlatList 
    data={leaderboard}
    keyExtractor={(item, index) => item.photo_ID || index.toString()}
    renderItem={({ item, index }) => (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.url }} style={styles.photo} />
        <Text style={styles.rank}>#{index + 1}</Text>
        <Text style={styles.likes}>Likes: {item.total_likes}</Text>
        <Text>Photo ID: {item.photo_id}</Text>
      </View>
    )}
  />
)}
    </SafeAreaView>
  );
}







const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    position: 'absolute',
    top: 15,
    left: 0,
    zIndex: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 5,
    position: 'relative',
    alignSelf: 'center',

  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  regionButton: {
    backgroundColor: '#eee',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 50,
  },
  likes: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  photo: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
});
