import React from 'react';
import { Text } from 'react-native';

interface TitleProps {
  text: string;
  className?: string;
}

const FirstTitle = ({ text, className }: TitleProps) => {
  return (
    <Text className={`text-4xl font-sans-bold-pro text-white ${className}`}>
      {text}
    </Text>
  );
};

export { FirstTitle };
