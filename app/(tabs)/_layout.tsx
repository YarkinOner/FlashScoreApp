import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#0A0E17',
          borderTopColor: '#1E293B',
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        headerShown: false,
      }}>

      {/* 1. MATCHES */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => <Ionicons name="football" size={size} color={color} />,
        }}
      />

      {/* 2. NEWS */}
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />,
        }}
      />

      {/* 3. LEAGUES (Ana Liste) */}
      <Tabs.Screen
        name="leagues/index"
        options={{
          title: 'Leagues',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
        }}
      />

      {/* 4. ACCOUNT */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />

      {/* 5. GİZLİ SEKME: LEAGUE DETAIL */}
      {/* Bu satır o fazlalık 5. sekmeyi alt bardan tamamen kaldırır */}
      <Tabs.Screen
        name="leagues/[id]"
        options={{
          href: null, // Alt bar menüsünde gösterme demek
        }}
      />

    </Tabs>
  );
}