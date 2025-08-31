import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

type FirstTitle = {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
};

const FirstTitle = ({ children, style }: FirstTitle) => (
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

export { FirstTitle };