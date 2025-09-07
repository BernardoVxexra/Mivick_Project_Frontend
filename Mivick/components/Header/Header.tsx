import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styleHeader';

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Mivick</Text>
      <View style={styles.spacer} />
    </View>
  );
}
