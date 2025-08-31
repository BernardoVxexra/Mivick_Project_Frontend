import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = ({ style, ...props }) => (
  <View style={[styles.container, style]}>
    <Image
      source={require('../../assets/logo.png')}
      style={styles.image}
      resizeMode="contain"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 120,
    height: 120,
  },
});

export default Logo;