import React from 'react';
import { Text } from 'react-native';

interface TitleProps {
  text: string;
}

const FirstTitle = ({ text }: TitleProps) => {
  return (
    <Text className="text-4xl font-sans-bold-pro text-white mb-2">
      {text}
    </Text>
  );
};

export { FirstTitle };