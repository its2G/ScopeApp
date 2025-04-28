// LeaderboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';
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
      <Text style={styles.title}>🏆 Leaderboard</Text>

      {/* Choose Region */}
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
          <Text>Region 4 - Battersea Park</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => setSelectedRegionId('da99e7fb-a911-4547-877c-a10c3265dba4')} style={styles.regionButton}>
          <Text>Region 5 - Gio's House</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => setSelectedRegionId('da99e7fb-a911-4547-877c-a10c3265dba4')} style={styles.regionButton}>
          <Text>Region 6 - Enzo's Place</Text>
        </TouchableOpacity>
        </View>
        

  

      {/* Show loading */}
      {loading && <Text>Loading...</Text>}

      {/* List leaderboard */}
      <FlatList 
        data={leaderboard}
        keyExtractor={(item, index) => item.photo_ID || index.toString()}
        renderItem={({ item, index }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.url }} style={styles.photo} />
        <Text style={styles.rank}>#{index + 1}</Text>
        <Text>Photo ID: {item.photo_ID}</Text>
        <Text>Likes: {item.total_likes}</Text>
    </View>
    )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', marginBottom: 20, borderRadius: 5,  marginRight: 10 },
  regionButton: { backgroundColor: '#eee', padding: 10, marginRight: 10, borderRadius: 5 },
  itemContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  rank: { fontWeight: 'bold', fontSize: 18 },
  photo: {
    width: '100%',
    height: 300,
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
});
