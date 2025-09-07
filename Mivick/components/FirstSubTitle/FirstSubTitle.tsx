import React from 'react';
import { Text } from 'react-native';
import { styles } from '../FirstSubTitle/styleSubTitle';

interface Props {
  text: string;
}

export function FirstSubTitle({ text }: Props) {
  return <Text style={styles.subTitle}>{text}</Text>;
}
