import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import MatchCard from '@/components/MatchCard';

export default function TabOneScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://v3.football.api-sports.io/fixtures',
          params: {
            live: 'all',
            league: '41'
          },
          headers: {
            'x-apisports-key': '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95'
          }
        };

        const response = await axios.request(options);
        setMatches(response.data.response || []);
      } catch (error) {
        // Konsol hatası İngilizceye çevrildi
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView className="flex-1">
        <View style={styles.header}>
          <Text style={styles.title}>
            FLASH<Text style={styles.accent}>SCORE</Text>
          </Text>
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
          ) : matches.length > 0 ? (
            matches.map((item: any) => (
              <MatchCard
                key={item.fixture.id}
                homeTeam={item.teams.home.name}
                awayTeam={item.teams.away.name}
                score={`${item.goals.home ?? 0} - ${item.goals.away ?? 0}`}
                time={`${item.fixture.status.elapsed}'`}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              {/* "Şu an canlı maç bulunmuyor" yazısı İngilizceye çevrildi */}
              <Text style={styles.emptyText}>No live matches available right now.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
  },
  accent: {
    color: '#3B82F6',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  }
});