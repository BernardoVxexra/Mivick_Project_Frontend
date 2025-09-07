import React from 'react';
import { View, Image } from 'react-native';
import { styles } from './styleLogo';

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logoImage}
      />
    </View>
  );
}
