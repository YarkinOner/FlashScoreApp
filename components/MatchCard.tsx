import { View, Text } from 'react-native';

export default function MatchCard() {
  return (
    <View style={{ backgroundColor: '#171E2E', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' }}>
      {/* Ev Sahibi */}
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ width: 40, height: 40, backgroundColor: '#334155', borderRadius: 20, marginBottom: 4 }} />
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Fenerbahçe</Text>
      </View>

      {/* Skor */}
      <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
        <Text style={{ color: '#3B82F6', fontSize: 20, fontWeight: '900' }}>2 - 1</Text>
        <Text style={{ color: '#94A3B8', fontSize: 10 }}>72'</Text>
      </View>

      {/* Deplasman */}
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ width: 40, height: 40, backgroundColor: '#334155', borderRadius: 20, marginBottom: 4 }} />
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Galatasaray</Text>
      </View>
    </View>
  );
}