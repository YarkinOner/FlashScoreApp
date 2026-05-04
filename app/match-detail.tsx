import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';

export default function MatchDetailScreen() {
  const { fixtureId } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [allStandings, setAllStandings] = useState<any[]>([]);
  const [matchStandings, setMatchStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Preview');

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

        setAllStandings(standingsRes.data);
        const filtered = standingsRes.data.filter((t: any) =>
          t.team_id === matchData.match_hometeam_id || t.team_id === matchData.match_awayteam_id
        );
        setMatchStandings(filtered);
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

  // Gol Özeti
  const renderGoalSummary = () => {
    const goals = details?.goal || [];
    if (goals.length === 0) return <Text style={styles.emptyText}>No goals recorded.</Text>;

    return (
      <View style={styles.goalSummaryCard}>
        {goals.map((g: any, index: number) => (
          <View key={index} style={styles.goalRow}>
            <View style={styles.goalTimeBadge}><Text style={styles.goalTimeText}>{g.time}'</Text></View>
            <Ionicons name="football" size={14} color="white" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.goalScorerText}>{g.goal_scorer || g.player}</Text>
              {/* Asist bilgisi varsa yazdır */}
              {g.info && g.info !== "" && <Text style={styles.assistText}>Assist: {g.info}</Text>}
            </View>
            <Text style={styles.miniScoreText}>{g.score}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPlayerList = (players: any[], side: 'home' | 'away') => (
    players.map((p: any) => (
      <View key={p.lineup_player} style={[styles.playerRow, side === 'away' && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.numberBadge, side === 'away' && { backgroundColor: '#3B82F6' }]}><Text style={styles.numberText}>{p.lineup_number}</Text></View>
        <Text style={[styles.playerName, side === 'away' && { textAlign: 'right', marginRight: 8, marginLeft: 0 }]}>{p.lineup_player}</Text>
      </View>
    ))
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Preview':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GOAL SUMMARY</Text>
            {renderGoalSummary()}

            <Text style={styles.sectionTitle}>MATCH INFO</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoBox}><Text style={styles.infoLabel}>Date</Text><Text style={styles.infoValue}>{details?.match_date}</Text></View>
              <View style={styles.infoBox}><Text style={styles.infoLabel}>Stadium</Text><Text style={styles.infoValue}>{details?.match_venue || "TBA"}</Text></View>
              <View style={[styles.infoBox, { borderBottomWidth: 0 }]}><Text style={styles.infoLabel}>Referee</Text><Text style={styles.infoValue}>{details?.match_referee || "TBA"}</Text></View>
            </View>

            <Text style={styles.sectionTitle}>HEAD TO HEAD STANDINGS</Text>
            <View style={styles.standingsTable}>
              {matchStandings.map((team: any) => (
                <View key={team.team_id} style={styles.standingsRow}>
                  <Text style={styles.posText}>{team.overall_league_position}. {team.team_name}</Text>
                  <Text style={styles.ptsText}>{team.overall_league_PTS} PTS</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'Line Up':
        return (
          <ScrollView style={styles.section}>
            <View style={styles.lineupContainer}>
              {/* Home Team */}
              <View style={styles.lineupSide}>
                <Text style={styles.teamHeader}>{details.match_hometeam_name}</Text>
                <Text style={styles.lineupSubTitle}>Starting XI</Text>
                {renderPlayerList(details.lineup?.home?.starting_lineups || [], 'home')}
                <Text style={[styles.lineupSubTitle, { marginTop: 15 }]}>Substitutes</Text>
                {renderPlayerList(details.lineup?.home?.substitutes || [], 'home')}
              </View>

              <View style={styles.lineupDivider} />

              {/* Away Team */}
              <View style={styles.lineupSide}>
                <Text style={[styles.teamHeader, { textAlign: 'right' }]}>{details.match_awayteam_name}</Text>
                <Text style={[styles.lineupSubTitle, { textAlign: 'right' }]}>Starting XI</Text>
                {renderPlayerList(details.lineup?.away?.starting_lineups || [], 'away')}
                <Text style={[styles.lineupSubTitle, { marginTop: 15, textAlign: 'right' }]}>Substitutes</Text>
                {renderPlayerList(details.lineup?.away?.substitutes || [], 'away')}
              </View>
            </View>
          </ScrollView>
        );
      case 'Stats':
        const uniqueStats = details?.statistics ? Array.from(new Map(details.statistics.map((item: any) => [item.type, item])).values()) : [];
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MATCH STATISTICS</Text>
            <View style={styles.infoCard}>
              {uniqueStats.map((stat: any, index: number) => (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statValue}>{stat.home}</Text>
                  <Text style={styles.statLabel}>{stat.type}</Text>
                  <Text style={styles.statValue}>{stat.away}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'Standings':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FULL LEAGUE TABLE</Text>
            <View style={styles.standingsTable}>
              {allStandings.map((team: any) => (
                <View key={team.team_id} style={[styles.standingsRow, (team.team_id === details.match_hometeam_id || team.team_id === details.match_awayteam_id) && {backgroundColor: 'rgba(59, 130, 246, 0.1)'}]}>
                  <Text style={styles.posText}>{team.overall_league_position}. {team.team_name}</Text>
                  <Text style={styles.ptsText}>{team.overall_league_PTS} PTS</Text>
                </View>
              ))}
            </View>
          </View>
        );
      default: return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0E17' }}>
      <Stack.Screen options={{ title: 'Match Details', headerTintColor: '#fff', headerStyle: { backgroundColor: '#171E2E' } }} />
      <View style={styles.headerCard}>
        <View style={styles.teamContainer}><Image source={{ uri: details?.team_home_badge }} style={styles.badgeLarge} /><Text style={styles.teamName}>{details?.match_hometeam_name}</Text></View>
        <View style={styles.scoreContainer}><Text style={styles.bigClockText}>{details?.match_hometeam_score !== "" ? `${details?.match_hometeam_score} - ${details?.match_awayteam_score}` : details?.match_time}</Text><View style={styles.statusBadge}><Text style={styles.statusLabel}>{isLive ? `${details?.match_status}'` : details?.match_status || "UPCOMING"}</Text></View></View>
        <View style={styles.teamContainer}><Image source={{ uri: details?.team_away_badge }} style={styles.badgeLarge} /><Text style={styles.teamName}>{details?.match_awayteam_name}</Text></View>
      </View>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          {['Preview', 'Line Up', 'Stats', 'Standings'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>{renderTabContent()}</ScrollView>
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
  bigClockText: { color: '#3B82F6', fontSize: 42, fontWeight: '900' },
  statusBadge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  statusLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  tabContainer: { backgroundColor: '#171E2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 10 },
  tabItem: { paddingVertical: 15, paddingHorizontal: 20, marginRight: 5 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#EF4444' },
  tabText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  activeTabText: { color: 'white' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: '#3B82F6', fontWeight: 'bold', fontSize: 12, marginBottom: 10, letterSpacing: 1 },
  goalSummaryCard: { backgroundColor: '#171E2E', borderRadius: 15, padding: 15, marginBottom: 20 },
  goalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  goalTimeBadge: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  goalTimeText: { color: '#3B82F6', fontSize: 12, fontWeight: 'bold' },
  goalScorerText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  assistText: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  miniScoreText: { color: '#10B981', fontWeight: 'bold', fontSize: 12 },
  infoCard: { backgroundColor: '#171E2E', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5, marginBottom: 20 },
  infoBox: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  infoLabel: { color: '#94A3B8', fontSize: 14 },
  infoValue: { color: 'white', fontWeight: '600' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B', alignItems: 'center' },
  statLabel: { color: '#94A3B8', fontSize: 12, flex: 1, textAlign: 'center' },
  statValue: { color: 'white', fontWeight: 'bold', width: 40, textAlign: 'center' },
  standingsTable: { backgroundColor: '#171E2E', borderRadius: 15, paddingHorizontal: 15, marginBottom: 20 },
  standingsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  posText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  ptsText: { color: '#3B82F6', fontWeight: 'bold' },
  lineupContainer: { flexDirection: 'row', backgroundColor: '#171E2E', borderRadius: 15, padding: 15 },
  lineupSide: { flex: 1 },
  lineupDivider: { width: 1, backgroundColor: '#1E293B', marginHorizontal: 10 },
  teamHeader: { color: '#3B82F6', fontWeight: 'bold', fontSize: 13, marginBottom: 10 },
  lineupSubTitle: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  playerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  numberBadge: { backgroundColor: '#EF4444', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  numberText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  playerName: { color: 'white', fontSize: 12, fontWeight: '500', flex: 1 },
  emptyText: { color: '#475569', textAlign: 'center', padding: 20, fontSize: 13 }
});