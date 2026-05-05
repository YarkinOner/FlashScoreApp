import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      {/* Şimdilik boş, ileride buraya profil detaylarını ekleyebiliriz */}
      <Text style={styles.text}>Account Screen Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17', // Uygulamanın koyu temasına uygun
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '500',
  },
});