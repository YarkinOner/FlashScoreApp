import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '9ad1dc238a6cf1daa4daaa901e06342d749005a17d6a09e3a6b1d3d62407da95';
const TARGET_LEAGUES = ['152', '302', '207', '175', '168', '322', '3'];

export default function MatchesScreen() {
  const [groupedFixtures, setGroupedFixtures] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formatDateForAPI = (date: Date) => date.toISOString().split('T')[0];

  const fetchMatches = async (date: Date) => {
    setLoading(true);
    const dateStr = formatDateForAPI(date);
    try {
      const requests = TARGET_LEAGUES.map(leagueId =>
        axios.get('https://apiv3.apifootball.com/', {
          params: { action: 'get_events', league_id: leagueId, from: dateStr, to: dateStr, APIkey: API_KEY }
        })
      );

      const responses = await Promise.all(requests);
      const groups: any = {};

      responses.forEach(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const leagueName = response.data[0].league_name;
          groups[leagueName] = response.data.sort((a: any, b: any) => a.match_time.localeCompare(b.match_time));
        }
      });

      setGroupedFixtures(groups);
    } catch (err) {
      console.error("Data fetching error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(selectedDate); }, [selectedDate]);

  const changeDay = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FLASH<Text style={{color: '#3B82F6'}}>SCORE</Text></Text>

        <View style={styles.dateSelectorContainer}>
          <TouchableOpacity onPress={() => changeDay(-1)} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.calendarText}>
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDay(1)} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {showPicker && (
        <DateTimePicker value={selectedDate} mode="date" display="default" onChange={(e, d) => { setShowPicker(false); if(d) setSelectedDate(d); }} />
      )}

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
        ) : Object.keys(groupedFixtures).length > 0 ? (
          Object.keys(groupedFixtures).map((leagueName) => (
            <View key={leagueName} style={styles.leagueSection}>
              <View style={styles.leagueHeader}>
                <Ionicons name="trophy-outline" size={14} color="#3B82F6" />
                <Text style={styles.leagueTitle}>{leagueName}</Text>
              </View>

              {groupedFixtures[leagueName].map((item: any, index: number) => (
                <Link
                  // HATA BURADA ÇÖZÜLDÜ: match_id yanına index ekleyerek benzersizliği garanti altına aldık
                  key={`${item.match_id}-${index}`}
                  href={{ pathname: "/match-detail", params: { fixtureId: item.match_id } }}
                  asChild
                >
                  <TouchableOpacity style={styles.matchCard}>
                    <Text style={styles.timeText}>
                      {item.match_status === "Finished" ? "FT" : item.match_time}
                    </Text>

                    <View style={styles.teamsColumn}>
                      <View style={styles.teamRow}>
                        <Image source={{ uri: item.team_home_badge }} style={styles.tinyBadge} />
                        <Text style={styles.teamName}>{item.match_hometeam_name}</Text>
                        <Text style={styles.scoreText}>{item.match_hometeam_score}</Text>
                      </View>
                      <View style={styles.teamRow}>
                        <Image source={{ uri: item.team_away_badge }} style={styles.tinyBadge} />
                        <Text style={styles.teamName}>{item.match_awayteam_name}</Text>
                        <Text style={styles.scoreText}>{item.match_awayteam_score}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.noMatchText}>No matches scheduled for this date.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  dateSelectorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#171E2E', borderRadius: 10, padding: 4 },
  arrowButton: { paddingHorizontal: 8 },
  calendarButton: { paddingHorizontal: 10, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1E293B' },
  calendarText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  leagueSection: { marginBottom: 20 },
  leagueHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 4 },
  leagueTitle: { color: '#3B82F6', fontSize: 12, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  matchCard: { backgroundColor: '#171E2E', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  timeText: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold', width: 45 },
  teamsColumn: { flex: 1, borderLeftWidth: 1, borderLeftColor: '#1E293B', paddingLeft: 12 },
  teamRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  tinyBadge: { width: 18, height: 18, marginRight: 8, resizeMode: 'contain' },
  teamName: { color: 'white', fontSize: 14, flex: 1 },
  scoreText: { color: '#3B82F6', fontSize: 14, fontWeight: 'bold', width: 20, textAlign: 'right' },
  emptyBox: { marginTop: 100, alignItems: 'center' },
  noMatchText: { color: '#94A3B8' }
});