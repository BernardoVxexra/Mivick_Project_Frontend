import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FirstSubTitle = ({ children, style }) => (
  <Text style={[styles.subtitle, style]}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    color: '#4a4e69',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default FirstSubTitle;