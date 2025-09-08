import React from 'react';
import { TextInput } from 'react-native';
import { styles } from '../FirstTextField/styleTextField';

interface Props {
  placeholder: string;
  [key: string]: any; // para props extras
}

export function FirstTextField({ placeholder, ...props }: Props) {
  return (
   <TextInput
  placeholder={placeholder}
  placeholderTextColor="#A0AEC0"
  style={[styles.input, props.style]} // <-- combina estilos
  {...props}
/>

  );
}
