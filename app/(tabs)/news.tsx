import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DUMMY_NEWS = [
  { id: '1', title: 'Champions League Final: Road to Munich', date: '2 hours ago', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500' },
  { id: '2', title: 'Transfer Update: New Stars on the Horizon', date: '5 hours ago', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500' },
  { id: '3', title: 'Premier League Title Race Heats Up', date: '1 day ago', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500' },
];

export default function NewsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LATEST <Text style={{color: '#3B82F6'}}>NEWS</Text></Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {DUMMY_NEWS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsCard}>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsInfo}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  newsCard: { backgroundColor: '#171E2E', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  newsImage: { width: '100%', height: 180, resizeMode: 'cover' },
  newsInfo: { padding: 12 },
  newsTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  newsDate: { color: '#94A3B8', fontSize: 12, marginTop: 4 }
});