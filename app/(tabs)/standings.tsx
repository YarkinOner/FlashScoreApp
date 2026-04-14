import { View, Text, ScrollView, SafeAreaView } from 'react-native';

export default function StandingsScreen() {
  const teams = [
    { rank: 1, name: 'Galatasaray', p: 32, w: 28, d: 3, l: 1, pts: 87 },
    { rank: 2, name: 'Fenerbahçe', p: 32, w: 26, d: 4, l: 2, pts: 82 },
    { rank: 3, name: 'Trabzonspor', p: 32, w: 16, d: 4, l: 12, pts: 52 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0E17' }}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 20 }}>
          Puan Durumu
        </Text>

        {/* Tablo Başlıkları */}
        <View style={{ flexDirection: 'row', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1F2937' }}>
          <Text style={{ color: '#94A3B8', width: 30 }}>#</Text>
          <Text style={{ color: '#94A3B8', flex: 1 }}>Takım</Text>
          <Text style={{ color: '#94A3B8', width: 30, textAlign: 'center' }}>O</Text>
          <Text style={{ color: '#94A3B8', width: 30, textAlign: 'center' }}>G</Text>
          <Text style={{ color: '#94A3B8', width: 40, textAlign: 'center', fontWeight: 'bold' }}>P</Text>
        </View>

        {/* Takım Listesi */}
        {teams.map((team) => (
          <View key={team.rank} style={{ flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#171E2E' }}>
            <Text style={{ color: team.rank <= 2 ? '#3B82F6' : 'white', width: 30 }}>{team.rank}</Text>
            <Text style={{ color: 'white', flex: 1, fontWeight: '500' }}>{team.name}</Text>
            <Text style={{ color: '#94A3B8', width: 30, textAlign: 'center' }}>{team.p}</Text>
            <Text style={{ color: '#94A3B8', width: 30, textAlign: 'center' }}>{team.w}</Text>
            <Text style={{ color: 'white', width: 40, textAlign: 'center', fontWeight: 'bold' }}>{team.pts}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}