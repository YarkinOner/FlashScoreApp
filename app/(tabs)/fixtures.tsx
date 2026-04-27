import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import axios from 'axios';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';

export default function FixturesScreen() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get('https://apiv3.apifootball.com/', {
          params: {
            action: 'get_events',
            league_id: '152',
            from: '2026-04-27',
            to: '2026-05-10',
            APIkey: API_KEY
          }
        });

        if (Array.isArray(response.data)) {
          setFixtures(response.data);
        } else {
          setError("No upcoming fixtures found.");
        }
      } catch (err) {
        setError("Failed to load fixtures.");
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Fixtures</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : (
          fixtures.map((item: any) => (
            <Link
              key={item.match_id}
              href={{
                pathname: "/match-detail",
                params: { fixtureId: item.match_id }
              }}
              asChild
            >
              <TouchableOpacity style={styles.matchCard}>
                <View style={styles.cardHeader}>
                  {/* Tarih Formatı Düzeltildi: Gün/Ay/Yıl */}
                  <Text style={styles.dateText}>
                    {item.match_date ? item.match_date.split('-').reverse().join('/') : '-'}
                  </Text>
                  <Text style={styles.timeText}>{item.match_time}</Text>
                </View>

                <View style={styles.teamsRow}>
                  <View style={styles.teamSection}>
                    <Image source={{ uri: item.team_home_badge }} style={styles.badge} />
                    <Text style={styles.teamName} numberOfLines={1}>{item.match_hometeam_name}</Text>
                  </View>

                  <Text style={styles.vsText}>VS</Text>

                  <View style={styles.teamSection}>
                    <Image source={{ uri: item.team_away_badge }} style={styles.badge} />
                    <Text style={styles.teamName} numberOfLines={1}>{item.match_awayteam_name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
  header: { paddingHorizontal: 16, marginTop: 10, marginBottom: 10 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  matchCard: {
    backgroundColor: '#171E2E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 8
  },
  dateText: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  timeText: { color: '#3B82F6', fontSize: 13, fontWeight: 'bold' },
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamSection: { flex: 1, alignItems: 'center' },
  badge: { width: 45, height: 45, marginBottom: 8, resizeMode: 'contain' },
  teamName: { color: 'white', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  vsText: { color: '#475569', fontSize: 14, fontWeight: '900', marginHorizontal: 10 },
  errorBox: { padding: 20, backgroundColor: '#171E2E', borderRadius: 12 },
  errorText: { color: '#94A3B8', textAlign: 'center' }
});