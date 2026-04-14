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
          elevation: 0, // Android için gölgeyi kaldırır
        },
        // Üstteki o beyaz başlığı (Tab One yazısını) tamamen kaldırır
        headerShown: false,
      }}>

      {/* Ana Sayfa (Maçlar) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Maçlar',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="soccer-ball-o" color={color} />,
        }}
      />

      {/* Puan Durumu (Standings) */}
      <Tabs.Screen
        name="standings"
        options={{
          title: 'Puan Durumu',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="list-ol" color={color} />,
        }}
      />
    </Tabs>
  );
}