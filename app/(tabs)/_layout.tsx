import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Alt menüdeki aktif ikonun rengi (Parlak Mavi)
        tabBarActiveTintColor: '#3B82F6',
        // Alt menüdeki inaktif ikonun rengi
        tabBarInactiveTintColor: '#94A3B8',
        // Alt menü arka plan rengi (Koyu Lacivert)
        tabBarStyle: {
          backgroundColor: '#171E2E',
          borderTopWidth: 0,
          height: 60, // Menü yüksekliğini biraz artırdık
          paddingBottom: 8,
          elevation: 0, // Android gölge kaldırıldı
        },
        // Üst başlığı (Header) gizler
        headerShown: false,
      }}>

      {/* 1. SEKMELİ: Maçlar (Ana Sayfa) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="soccer-ball-o" color={color} />,
        }}
      />

      {/* 2. SEKMELİ: Puan Durumu */}
      <Tabs.Screen
        name="standings"
        options={{
          title: 'Standings',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="list-ol" color={color} />,
        }}
      />

      {/* 3. SEKMELİ: Fikstür (Yeni eklenen fixtures.tsx için) */}
      <Tabs.Screen
        name="fixtures"
        options={{
          title: 'Fixtures',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="calendar" color={color} />,
        }}
      />

    </Tabs>
  );
}