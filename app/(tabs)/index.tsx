import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import MatchCard from '@/components/MatchCard';

export default function TabOneScreen() {
  return (
    // style={...} kısmını ekledik ki Tailwind çalışmasa bile ekran siyah olsun
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0E17' }}>
      <ScrollView className="flex-1 px-4">
        <View style={{ marginTop: 40, marginBottom: 20, paddingHorizontal: 16 }}>
          <Text style={{ color: 'white', fontSize: 28, fontWeight: '900' }}>
            FLASH<Text style={{ color: '#3B82F6' }}>SCORE</Text>
          </Text>
        </View>

        {/* Maç Listesi */}
        <View style={{ paddingHorizontal: 16 }}>
          <MatchCard />
          <MatchCard />
          <MatchCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}