import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  text: string;
}

const FirstButton = ({ text }: ButtonProps) => {
  return (
    <TouchableOpacity className="btn w-full p-4">
      <Text className="text-white font-sans-bold-pro text-lg">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export {FirstButton} ;