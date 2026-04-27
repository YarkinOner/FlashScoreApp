import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';

export default function MatchDetailScreen() {
  const { fixtureId } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Summary'); // Aktif sekme kontrolü

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_events', match_id: fixtureId, APIkey: API_KEY }
        });
        const matchData = response.data[0];
        setDetails(matchData);

        const standingsRes = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_standings', league_id: matchData.league_id, APIkey: API_KEY }
        });

        const filtered = standingsRes.data.filter((t: any) =>
          t.team_id === matchData.match_hometeam_id || t.team_id === matchData.match_awayteam_id
        );
        setStandings(filtered);
      } catch (error) {
        console.error("Detail Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [fixtureId]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /></View>;

  const isLive = details?.match_status !== "" && details?.match_status !== "Finished" && !details?.match_status.includes(":");

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Summary':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MATCH PREVIEW</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{details?.match_date ? details.match_date.split('-').reverse().join('/') : '-'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Stadium</Text>
                <Text style={styles.infoValue}>{(!details?.match_venue || details?.match_venue === "" || details?.match_venue === "TBD") ? "TBD" : details?.match_venue}</Text>
              </View>
              <View style={[styles.infoBox, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Referee</Text>
                <Text style={styles.infoValue}>{details?.match_referee || "TBA"}</Text>
              </View>
            </View>
          </View>
        );
      case 'Standings':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LIVE STANDINGS</Text>
            <View style={styles.standingsTable}>
              {standings.map((team: any) => (
                <View key={team.team_id} style={styles.standingsRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.posText}>{team.overall_league_position}.</Text>
                    <Text style={styles.teamRowName}>{team.team_name}</Text>
                  </View>
                  <Text style={styles.ptsText}>{team.overall_league_PTS} PTS</Text>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.section}>
            <Text style={styles.emptyText}>{activeTab} data will be here.</Text>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0E17' }}>
      <Stack.Screen options={{ title: 'Match Details', headerTintColor: '#fff', headerStyle: { backgroundColor: '#171E2E' } }} />

      {/* Üst Skor Kartı */}
      <View style={styles.headerCard}>
        <View style={styles.teamContainer}>
          <Image source={{ uri: details?.team_home_badge }} style={styles.badgeLarge} />
          <Text style={styles.teamName}>{details?.match_hometeam_name}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.bigClockText}>
            {details?.match_hometeam_score !== "" ? `${details?.match_hometeam_score} - ${details?.match_awayteam_score}` : details?.match_time}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusLabel}>{isLive ? `${details?.match_status}'` : details?.match_status || "UPCOMING"}</Text>
          </View>
        </View>
        <View style={styles.teamContainer}>
          <Image source={{ uri: details?.team_away_badge }} style={styles.badgeLarge} />
          <Text style={styles.teamName}>{details?.match_awayteam_name}</Text>
        </View>
      </View>

      {/* SEKME MENÜSÜ */}
      <View style={styles.tabBar}>
        {['Summary', 'Line Up', 'Stats', 'Standings'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>{renderTabContent()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
  headerCard: { flexDirection: 'row', backgroundColor: '#171E2E', paddingVertical: 40, paddingHorizontal: 15, justifyContent: 'space-between', alignItems: 'center' },
  teamContainer: { alignItems: 'center', flex: 1.2 },
  badgeLarge: { width: 65, height: 65, marginBottom: 10, resizeMode: 'contain' },
  teamName: { color: 'white', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  scoreContainer: { flex: 1.8, alignItems: 'center' },
  bigClockText: { color: '#3B82F6', fontSize: 40, fontWeight: '900' },
  statusBadge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  statusLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },

  // Tab Stilleri
  tabBar: { flexDirection: 'row', backgroundColor: '#171E2E', borderBottomWidth: 1, borderBottomColor: '#1E293B', paddingHorizontal: 10 },
  tabItem: { paddingVertical: 15, paddingHorizontal: 15, marginRight: 10 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#EF4444' }, // Fotoğraftaki gibi kırmızı alt çizgi
  tabText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: 'white' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: '#3B82F6', fontWeight: 'bold', fontSize: 12, marginBottom: 10 },
  infoCard: { backgroundColor: '#171E2E', borderRadius: 15, paddingHorizontal: 15 },
  infoBox: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  infoLabel: { color: '#94A3B8', fontSize: 14 },
  infoValue: { color: 'white', fontWeight: '600' },
  standingsTable: { backgroundColor: '#171E2E', borderRadius: 15, paddingHorizontal: 15 },
  standingsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  posText: { color: '#3B82F6', fontWeight: 'bold', width: 25 },
  teamRowName: { color: 'white' },
  ptsText: { color: '#94A3B8', fontWeight: 'bold' },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 50 }
});