import React from 'react';
import { View, Image } from 'react-native';

const Logo = () => {
  return (
    <View className="items-center">
      <Image
        source={require('../../assets/logo.png')} // Ajuste o caminho
        className="w-24 h-24"
      />
    </View>
  );
};

export {Logo} ;