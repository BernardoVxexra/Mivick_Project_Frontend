import React from 'react';
import { Text } from 'react-native';
import { styles } from '../FirstTitle/styleTitle';

interface Props {
  text: string;
}

export function FirstTitle({ text }: Props) {
  return <Text style={styles.title}>{text}</Text>;
}
