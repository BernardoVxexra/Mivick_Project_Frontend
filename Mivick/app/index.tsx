// Mivick/app/index.tsx (antigo WelcomeScreen.tsx)
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FirstButton } from '@/components/FirstButton/FirstButton';

const index = () => {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-background">
      <Image
        source={require('../assets/carousel-1.jpg')}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute bottom-10 w-full px-8">
        <Text className="text-white text-center text-4xl font-sans-bold-pro mb-8">
          Mivick
        </Text>
        <FirstButton text="Entrar" onPress={() => router.push('/(screens)/home')} />
        <TouchableOpacity className="mt-4 items-center" onPress={() => router.push('/(screens)/home')}>
          <Text className="text-primary font-sans-bold-pro text-lg">
            Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// eas build -p android --profile production  (gera o app)
