import React from 'react';
import { View } from 'react-native';
import { styles } from '../FirstCard/styleCard';

interface CardProps {
  children: React.ReactNode;
}

export function FirstCard({ children }: CardProps) {
  return <View style={styles.cardContainer}>{children}</View>;
}
