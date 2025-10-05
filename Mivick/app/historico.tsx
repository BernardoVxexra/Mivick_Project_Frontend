import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Historico() {
  const params = useLocalSearchParams();
  const image = params.image as string ?? '';

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.card} resizeMode="contain" />
      ) : (
        <View style={styles.card} />
      )}
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
