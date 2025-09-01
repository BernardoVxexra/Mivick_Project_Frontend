// Mivick/components/FirstButton/index.tsx
import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

// Defina a interface para as props do seu componente
interface ButtonProps extends TouchableOpacityProps {
  text: string;
}

const FirstButton = ({ text, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity className="btn w-full p-4" {...props}>
      <Text className="text-white font-sans-bold-pro text-lg">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export {FirstButton} ;