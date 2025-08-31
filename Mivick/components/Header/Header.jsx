import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter @expo/vector-icons instalado

const Header = ({ title = "Mivick Project", onMenuPress, style }) => (
  <View style={[styles.container, style]}>
    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
      <Ionicons name="menu" size={28} color="#22223b" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <View style={{ width: 40 }} /> {/* Espaço para alinhar o título ao centro */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    justifyContent: 'space-between',
  },
  menuButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22223b',
  },
});

export default Header;