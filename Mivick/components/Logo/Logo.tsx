import React from 'react';
import { View, Image } from 'react-native';

interface LogoProps {
  className?: string; // Adicione a interface para aceitar a prop className
}

const Logo = ({ className }: LogoProps) => {
  return (
    <View className={`items-center ${className}`}> 
      <Image
        source={require('../../assets/logo.png')} // Ajuste o caminho
        className="w-24 h-24"
      />
    </View>
  );
};

export { Logo } ;
