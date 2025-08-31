import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

type FirstSubTitleProps = {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
};

const FirstSubTitle = ({ children, style }: FirstSubTitleProps) => (
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

export { FirstSubTitle };