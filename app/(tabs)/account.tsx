import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      {/* Configure the header title via Stack.Screen if needed */}
      <Stack.Screen options={{ title: 'Account', headerShadowVisible: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.name}>User Name</Text>
          <Text style={styles.email}>user@example.com</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <MenuLink icon="notifications-outline" title="Notifications" />
          <MenuLink icon="star-outline" title="Favorite Teams" />
          <MenuLink icon="settings-outline" title="App Settings" />
          <MenuLink icon="shield-checkmark-outline" title="Privacy Policy" />
          <MenuLink icon="help-circle-outline" title="Support & Feedback" />

          <TouchableOpacity style={[styles.menuItem, { marginTop: 30 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={22} color="#ff4444" />
              <Text style={[styles.menuText, { color: '#ff4444' }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Reusable Menu Component
function MenuLink({ icon, title }: { icon: any, title: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color="#fff" />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#444" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Matching your dark theme
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: '#94a3b8',
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1e293b',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
});