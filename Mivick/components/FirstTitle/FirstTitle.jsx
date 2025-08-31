import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FirstTitle = ({ children, style }) => (
  <Text style={[styles.title, style]}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: 1,
  },
});

export default FirstTitle;