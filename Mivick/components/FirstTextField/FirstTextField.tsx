import React from 'react';
import { TextInput } from 'react-native';

interface TextFieldProps {
  placeholder: string;
}

const FirstTextField = ({ placeholder }: TextFieldProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#A0AEC0"
      className="input mt-4" // Use 'input' e classes utilitárias como 'mt-4'
    />
  );
};

export { FirstTextField };