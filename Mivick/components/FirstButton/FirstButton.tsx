import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { styles } from './styleButton';

interface Props {
  title: string;
  onPress: () => void;
  customStyle?: StyleProp<ViewStyle>;      // ✅ permite sobrescrever o estilo do botão
  customTextStyle?: StyleProp<TextStyle>;  // ✅ permite sobrescrever o estilo do texto
}

export function FirstButton({ title, onPress, customStyle, customTextStyle }: Props) {
  return (
    <TouchableOpacity style={[styles.btn, customStyle]} onPress={onPress}>
      <Text style={[styles.text, customTextStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
