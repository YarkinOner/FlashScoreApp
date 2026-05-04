import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

// MLS has been removed from the league list
const LEAGUES = [
  { id: '152', name: 'Premier League', country: 'England', logo: 'https://apiv3.apifootball.com/datasets/leagues/152_premier_league.png' },
  { id: '302', name: 'La Liga', country: 'Spain', logo: 'https://apiv3.apifootball.com/datasets/leagues/302_la_liga.png' },
  { id: '207', name: 'Serie A', country: 'Italy', logo: 'https://apiv3.apifootball.com/datasets/leagues/207_serie_a.png' },
  { id: '175', name: 'Bundesliga', country: 'Germany', logo: 'https://apiv3.apifootball.com/datasets/leagues/175_bundesliga.png' },
  { id: '168', name: 'Ligue 1', country: 'France', logo: 'https://apiv3.apifootball.com/datasets/leagues/168_ligue_1.png' },
  { id: '3', name: 'Champions League', country: 'Europe', logo: 'https://apiv3.apifootball.com/datasets/leagues/3_champions_league.png' },
  { id: '4', name: 'Europa League', country: 'Europe', logo: 'https://apiv3.apifootball.com/datasets/leagues/4_europa_league.png' },
  { id: '322', name: 'Süper Lig', country: 'Turkey', logo: 'https://apiv3.apifootball.com/datasets/leagues/322_super_lig.png' },
];

export default function LeaguesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Leagues',
          headerStyle: { backgroundColor: '#0A0E17' },
          headerTintColor: '#fff',
          headerShadowVisible: false
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Major Leagues</Text>

        {LEAGUES.map((league) => (
          <TouchableOpacity
            key={league.id}
            style={styles.leagueCard}
            onPress={() => router.push({
              pathname: '/(tabs)/standings',
              params: { leagueId: league.id }
            })}
          >
            <View style={styles.leagueInfo}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: league.logo }}
                  style={styles.leagueLogo}
                  defaultSource={{ uri: 'https://via.placeholder.com/100' }}
                />
              </View>
              <View>
                <Text style={styles.leagueName}>{league.name}</Text>
                <Text style={styles.countryName}>{league.country}</Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="#3B82F6" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerTitle: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  leagueCard: {
    backgroundColor: '#171E2E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden'
  },
  leagueLogo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  leagueName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countryName: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
});