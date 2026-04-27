import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';

export default function StandingsScreen() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualLeagueName, setActualLeagueName] = useState("Premier League");

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        // 1. Dynamic League Discovery: Scan leagues in your account
        const leaguesRes = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_leagues', country_id: '44', APIkey: API_KEY }
        });

        // Find the league containing "Premier League"
        const premierLeague = leaguesRes.data.find((l: any) =>
          l.league_name.includes("Premier League")
        );

        // Fallback to league ID 152 if not found
        const targetId = premierLeague ? premierLeague.league_id : '152';
        setActualLeagueName(premierLeague ? premierLeague.league_name : "Premier League Standings");

        // 2. Fetch standings with the discovered ID
        const response = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_standings', league_id: targetId, APIkey: API_KEY }
        });

        console.log("Premier League Standings Loaded");

        if (Array.isArray(response.data)) {
          setStandings(response.data);
          setError(null);
        } else if (response.data.error) {
          setError(`API Error: ${response.data.error}`);
        } else {
          setError("No data found for this league.");
        }
      } catch (err) {
        setError("An error occurred while connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.headerTitle}>{actualLeagueName}</Text>

        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, { flex: 1.5, textAlign: 'left' }]}># TEAM</Text>
              <Text style={styles.headerCell}>MP</Text>
              <Text style={styles.headerCell}>W</Text>
              <Text style={styles.headerCell}>PTS</Text>
            </View>

            {/* Team List */}
            {standings.map((team: any) => (
              <View key={team.team_id} style={styles.row}>
                <View style={styles.teamInfoSection}>
                  <Text style={styles.positionText}>{team.overall_league_position}.</Text>
                  {/* Team badge */}
                  <Image source={{ uri: team.team_badge }} style={styles.tinyLogo} />
                  <Text style={styles.teamNameText} numberOfLines={1}>{team.team_name}</Text>
                </View>
                <Text style={styles.cell}>{team.overall_league_payed}</Text>
                <Text style={styles.cell}>{team.overall_league_W}</Text>
                <Text style={styles.pointsText}>{team.overall_league_PTS}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  table: { backgroundColor: '#171E2E', borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1E293B', alignItems: 'center' },
  headerRow: { backgroundColor: '#1E293B' },
  teamInfoSection: { flex: 1.5, flexDirection: 'row', alignItems: 'center' },
  positionText: { color: '#94A3B8', fontSize: 13, width: 25 },
  tinyLogo: { width: 28, height: 28, marginRight: 10, resizeMode: 'contain' },
  teamNameText: { color: 'white', fontSize: 15, fontWeight: '500', flex: 1 },
  cell: { color: '#94A3B8', width: 35, textAlign: 'center', fontSize: 14 },
  headerCell: { color: '#94A3B8', width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
  pointsText: { color: '#3B82F6', width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 15 },
  errorBox: { padding: 20, backgroundColor: '#450a0a', borderRadius: 8 },
  errorText: { color: '#f87171', textAlign: 'center' }
});