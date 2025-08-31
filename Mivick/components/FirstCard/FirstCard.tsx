import React from 'react';
import { View, Text } from 'react-native';

interface CardProps {
  children: React.ReactNode;
}

const FirstCard = ({ children }: CardProps) => {
  return (
    <View className="bg-gray-800 rounded-lg p-4 my-2">
      {children}
    </View>
  );
};

export {FirstCard} ;