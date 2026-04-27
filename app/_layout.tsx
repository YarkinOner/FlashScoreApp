import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Dosya ismin neyse 'name' kısmına tam olarak onu yazmalısın */}
      <Stack.Screen
        name="match-detail"
        options={{
          title: 'Match Details',
          headerStyle: { backgroundColor: '#171E2E' },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}