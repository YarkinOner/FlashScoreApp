import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router'; // Parametreyi yakalamak için eklendi
import axios from 'axios';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';

export default function StandingsScreen() {
  // Leagues sayfasından gelen leagueId'yi alıyoruz
  const { leagueId } = useLocalSearchParams();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualLeagueName, setActualLeagueName] = useState("Standings");

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        // Eğer bir leagueId gelmişse onu kullan, gelmemişse varsayılan Premier League (152) kullan
        const targetId = leagueId || '152';

        const response = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_standings', league_id: targetId, APIkey: API_KEY }
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setStandings(response.data);
          // Lig adını veriden dinamik olarak alıyoruz
          setActualLeagueName(response.data[0].league_name);
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
  }, [leagueId]); // leagueId değiştiğinde useEffect tekrar çalışır

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.headerTitle}>{actualLeagueName}</Text>

        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : (
          <View style={styles.table}>
            {/* Tablo Başlığı */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, { flex: 1.5, textAlign: 'left', fontWeight: 'bold', color: 'white' }]}># TEAM</Text>
              <Text style={styles.headerCell}>MP</Text>
              <Text style={styles.headerCell}>W</Text>
              <Text style={styles.headerCell}>PTS</Text>
            </View>

            {/* Takım Listesi */}
            {standings.map((team: any) => (
              <View key={team.team_id} style={styles.row}>
                <View style={styles.teamInfoSection}>
                  <Text style={styles.positionText}>{team.overall_league_position}.</Text>
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
  container: { flex: 1, backgroundColor: '#0A0E17' }, // Karanlık tema arka planı
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  table: { backgroundColor: '#171E2E', borderRadius: 12, overflow: 'hidden' }, // Kart yapısı
  row: { flexDirection: 'row', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1E293B', alignItems: 'center' },
  headerRow: { backgroundColor: '#1E293B' },
  teamInfoSection: { flex: 1.5, flexDirection: 'row', alignItems: 'center' },
  positionText: { color: '#94A3B8', fontSize: 13, width: 25 },
  tinyLogo: { width: 28, height: 28, marginRight: 10, resizeMode: 'contain' },
  teamNameText: { color: 'white', fontSize: 15, fontWeight: '500', flex: 1 },
  cell: { color: '#94A3B8', width: 35, textAlign: 'center', fontSize: 14 },
  headerCell: { color: '#94A3B8', width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
  pointsText: { color: '#3B82F6', width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 15 }, // Puan rengi vurgulu
  errorBox: { padding: 20, backgroundColor: '#450a0a', borderRadius: 8 },
  errorText: { color: '#f87171', textAlign: 'center' }
});