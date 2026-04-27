import { View, Text } from 'react-native';

interface MatchProps {
  homeTeam: string;
  awayTeam: string;
  score: string;
  time: string;
}

export default function MatchCard({ homeTeam, awayTeam, score, time }: MatchProps) {
  return (
    <View style={{ backgroundColor: '#171E2E', borderRadius: 16, padding: 20, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Ev Sahibi */}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#2D3748', marginBottom: 8 }} />
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{homeTeam}</Text>
        </View>

        {/* Skor ve Süre */}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: '#3B82F6', fontSize: 20, fontWeight: 'bold' }}>{score}</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>{time}</Text>
        </View>

        {/* Deplasman */}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#2D3748', marginBottom: 8 }} />
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{awayTeam}</Text>
        </View>
      </View>
    </View>
  );
}