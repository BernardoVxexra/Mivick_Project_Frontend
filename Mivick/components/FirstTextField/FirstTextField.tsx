import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface TextFieldProps extends TextInputProps {
  placeholder: string;
  className?: string; // Prop para estilos adicionais
}

const FirstTextField = ({ placeholder, className, ...props }: TextFieldProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#A0AEC0"
      className={`input ${className}`}
      {...props}
    />
  );
};

export { FirstTextField };
