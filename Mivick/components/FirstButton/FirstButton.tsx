import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  className?: string;
  textClassName?: string;
}

const FirstButton = ({ text, className, textClassName, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity 
      className={`w-full py-4 rounded-lg items-center ${className}`} 
      {...props}
    >
      <Text className={`text-xl font-sans-bold-pro text-white ${textClassName}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export { FirstButton };
