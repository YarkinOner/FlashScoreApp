import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Platform, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';

export default function LeagueDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Data States
  const [standings, setStandings] = useState<any[]>([]);
  const [weeks, setWeeks] = useState<{ [key: string]: any[] }>({});
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [fixWeeks, setFixWeeks] = useState<{ [key: string]: any[] }>({});
  const [fixAvailableWeeks, setFixAvailableWeeks] = useState<string[]>([]);
  const [selectedFixWeek, setSelectedFixWeek] = useState<string | null>(null);
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [topAssists, setTopAssists] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Results');

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  };

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        setLoading(true);

        // 1. Puan Durumu
        const standingsRes = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_standings', league_id: id, APIkey: API_KEY }
        });
        setStandings(standingsRes.data);

        // 2. Maçlar (Results & Fixtures)
        const from = new Date(); from.setDate(from.getDate() - 30);
        const to = new Date(); to.setDate(to.getDate() + 90);
        const eventsRes = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_events', league_id: id, from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0], APIkey: API_KEY }
        });

        if (Array.isArray(eventsRes.data)) {
          const resMap: { [key: string]: any[] } = {};
          const fixMap: { [key: string]: any[] } = {};

          eventsRes.data.forEach(match => {
            const week = match.match_round || "1";
            if (match.match_status === "Finished") {
              if (!resMap[week]) resMap[week] = [];
              resMap[week].push(match);
            } else {
              if (!fixMap[week]) fixMap[week] = [];
              fixMap[week].push(match);
            }
          });

          const sortedResKeys = Object.keys(resMap).sort((a, b) => parseInt(b) - parseInt(a));
          const sortedFixKeys = Object.keys(fixMap).sort((a, b) => parseInt(a) - parseInt(b));

          setWeeks(resMap);
          setAvailableWeeks(sortedResKeys);
          setSelectedWeek(sortedResKeys[0]);
          setFixWeeks(fixMap);
          setFixAvailableWeeks(sortedFixKeys);
          setSelectedFixWeek(sortedFixKeys[0]);
        }

        // 3. Stats (Top Scorers & Assists)
        const statsRes = await axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_topscorers', league_id: id, APIkey: API_KEY }
        });

        if (Array.isArray(statsRes.data)) {
          setTopScorers(statsRes.data.slice(0, 5));
          const sortedAssists = [...statsRes.data].sort((a, b) => parseInt(b.assists || 0) - parseInt(a.assists || 0));
          setTopAssists(sortedAssists.slice(0, 5));
        }

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagueData();
  }, [id]);

  const renderMatchList = (isFixture: boolean) => {
    const currentWeeks = isFixture ? fixWeeks : weeks;
    const currentAvailable = isFixture ? fixAvailableWeeks : availableWeeks;
    const currentSelected = isFixture ? selectedFixWeek : selectedWeek;
    const setWeek = isFixture ? setSelectedFixWeek : setSelectedWeek;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{isFixture ? "UPCOMING FIXTURES" : "LEAGUE RESULTS"}</Text>
        <View style={styles.weekSelectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentAvailable.map((week) => (
              <TouchableOpacity
                key={week}
                onPress={() => setWeek(week)}
                style={[styles.weekChip, currentSelected === week && styles.activeWeekChip]}
              >
                <Text style={[styles.weekChipText, currentSelected === week && styles.activeWeekChipText]}>WEEK {week}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {currentSelected && currentWeeks[currentSelected] ? (
          currentWeeks[currentSelected].map((match) => (
            <View key={match.match_id} style={styles.matchResultRow}>
              <Text style={styles.matchDateText}>{formatDate(match.match_date)} - {match.match_time}</Text>
              <View style={styles.scoreRow}>
                <View style={styles.teamInfoSide}>
                  <Text style={styles.teamNameText} numberOfLines={1}>{match.match_hometeam_name}</Text>
                  <Image source={{ uri: match.team_home_badge }} style={styles.miniBadge} />
                </View>
                <View style={[styles.resultBadge, isFixture && {backgroundColor: '#1E293B'}]}>
                  <Text style={[styles.resultScoreText, isFixture && {color: '#94A3B8'}]}>
                    {isFixture ? 'VS' : `${match.match_hometeam_score} - ${match.match_awayteam_score}`}
                  </Text>
                </View>
                <View style={[styles.teamInfoSide, { justifyContent: 'flex-start' }]}>
                  <Image source={{ uri: match.team_away_badge }} style={styles.miniBadge} />
                  <Text style={[styles.teamNameText, { textAlign: 'left' }]} numberOfLines={1}>{match.match_awayteam_name}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No data found for this period.</Text>
        )}
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* CUSTOM HEADER - LEAGUES'E DÖNER */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/leagues')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>League Details</Text>
      </View>

      {/* TABS - RESULTS, FIXTURES, STANDINGS, STATS */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Results', 'Fixtures', 'Standings', 'Stats'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {activeTab === 'Results' && renderMatchList(false)}
        {activeTab === 'Fixtures' && renderMatchList(true)}
        {activeTab === 'Standings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LEAGUE TABLE</Text>
            <View style={styles.standingsTable}>
              {standings.map((team: any) => (
                <View key={team.team_id} style={styles.standingsRow}>
                  <Text style={styles.posText}>{team.overall_league_position}.</Text>
                  <View style={styles.teamInfo}>
                    <Image source={{ uri: team.team_badge }} style={styles.miniBadge} />
                    <Text style={styles.teamText} numberOfLines={1}>{team.team_name}</Text>
                  </View>
                  <Text style={styles.ptsText}>{team.overall_league_PTS} PTS</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {activeTab === 'Stats' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TOP 5 GOAL SCORERS</Text>
            <View style={styles.statsCard}>
              {topScorers.map((p, i) => (
                <View key={i} style={styles.statsRow}>
                  <Text style={styles.statsRank}>{i + 1}.</Text>
                  <View style={{ flex: 1 }}><Text style={styles.playerName}>{p.player_name}</Text><Text style={styles.playerTeam}>{p.team_name}</Text></View>
                  <Text style={styles.statsValue}>{p.goals} G</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>TOP 5 ASSISTS</Text>
            <View style={styles.statsCard}>
              {topAssists.map((p, i) => (
                <View key={i} style={styles.statsRow}>
                  <Text style={styles.statsRank}>{i + 1}.</Text>
                  <View style={{ flex: 1 }}><Text style={styles.playerName}>{p.player_name}</Text><Text style={styles.playerTeam}>{p.team_name}</Text></View>
                  <Text style={styles.statsValue}>{p.assists || 0} A</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
  customHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  backButton: { padding: 5, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#0A0E17', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tabItem: { paddingVertical: 15, paddingHorizontal: 20, marginRight: 5 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#EF4444' },
  tabText: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  activeTabText: { color: 'white' },
  section: { paddingHorizontal: 16, marginTop: 25 },
  sectionTitle: { color: '#3B82F6', fontWeight: 'bold', fontSize: 11, marginBottom: 15, letterSpacing: 1.2, textTransform: 'uppercase' },
  weekSelectorContainer: { marginBottom: 20 },
  weekChip: { backgroundColor: '#171E2E', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#1E293B' },
  activeWeekChip: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  weekChipText: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' },
  activeWeekChipText: { color: 'white' },
  matchResultRow: { backgroundColor: '#171E2E', borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#1E293B' },
  matchDateText: { color: '#475569', fontSize: 10, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamInfoSide: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  teamNameText: { color: 'white', fontSize: 12, fontWeight: '600', marginHorizontal: 8, flex: 1, textAlign: 'right' },
  miniBadge: { width: 24, height: 24, resizeMode: 'contain' },
  resultBadge: { backgroundColor: '#0A0E17', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, minWidth: 65, alignItems: 'center' },
  resultScoreText: { color: '#3B82F6', fontWeight: '900', fontSize: 14 },
  standingsTable: { backgroundColor: '#171E2E', borderRadius: 15, paddingHorizontal: 15 },
  standingsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B', alignItems: 'center' },
  posText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13, width: 30 },
  teamInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10 },
  teamText: { color: 'white', fontWeight: '600', fontSize: 14 },
  ptsText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 14 },
  statsCard: { backgroundColor: '#171E2E', borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#1E293B' },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  statsRank: { color: '#94A3B8', fontWeight: 'bold', width: 30 },
  playerName: { color: 'white', fontWeight: '600', fontSize: 14 },
  playerTeam: { color: '#475569', fontSize: 12 },
  statsValue: { color: '#3B82F6', fontWeight: 'bold' },
  emptyText: { color: '#475569', textAlign: 'center', marginTop: 15, fontSize: 13 }
});