// LeaderboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../components/Supabase';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LeaderboardScreen({ navigation }) {
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [regionsError, setRegionsError] = useState(null);

  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1) Fetch regions once on mount
  useEffect(() => {
    async function loadRegions() {
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('regionID, identifier')
          .order('identifier', { ascending: true });
        if (error) throw error;
        setRegions(data);
      } catch (err) {
        setRegionsError(err.message);
      } finally {
        setRegionsLoading(false);
      }
    }
    loadRegions();
  }, []);

  // 2) Load the leaderboard when a region is selected
  useEffect(() => {
    async function fetchLeaderboard() {
      if (!selectedRegionId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('fetch_leaderboard', {
          regionid: selectedRegionId
        });
        if (error) throw error;
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [selectedRegionId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar with back arrow */}
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

      {/* 3) Region selection */}
      {regionsLoading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : regionsError ? (
        <Text style={{ color: 'red' }}>Error: {regionsError}</Text>
      ) : !selectedRegionId ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {regions.map(region => (
            <View key={region.regionID} style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setSelectedRegionId(region.regionID)}
                style={styles.regionButton}
              >
                <Text>{region.identifier}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <TouchableOpacity
            onPress={() => setSelectedRegionId(null)}
            style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 10 }}
          >
            <Text style={{ fontWeight: 'bold' }}>🔙 Back to Region Selection</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4) Show loading for leaderboard */}
      {loading && <Text>Loading leaderboard…</Text>}

      {/* 5) Render the leaderboard once a region is selected */}
      {selectedRegionId && !loading && (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => item.photo_id || index.toString()}
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
    flex:          1,
    padding:       20,
    backgroundColor:'white',
  },
  topBar: {
    width:          '100%',
    flexDirection:  'row',
    justifyContent: 'flex-start',
    padding:        10,
    position:       'absolute',
    top:            15,
    left:           0,
    zIndex:         1,
  },
  title: {
    fontSize:     24,
    fontWeight:   'bold',
    marginBottom: 20,
    marginTop:    50,
    textAlign:    'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom:  12,
  },
  regionButton: {
    backgroundColor:'#eee',
    padding:        16,
    borderRadius:   8,
  },
  itemContainer: {
    padding:           10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    fontWeight: 'bold',
    fontSize:   24,
  },
  likes: {
    fontWeight: 'bold',
    fontSize:   18,
  },
  photo: {
    width:        '100%',
    height:       300,
    marginBottom: 10,
  },
});
