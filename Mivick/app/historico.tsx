import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Historico({ route }: any) {
  const { image } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.card} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
  },
});
