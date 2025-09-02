import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Importando os componentes
import { Carousel } from '@/components/FirstCarrousel/FirstCarrousel';
import { FirstButton } from '@/components/FirstButton/index';
import "./global.css";

// Substitua com as imagens do seu carrossel
const carouselImages = [
  require('../assets/Images/carousel_image_1.jpeg'),
  require('../assets/Images/carousel_image_2.jpeg'),
  require('../assets/Images/carousel_image_3.jpeg'),
];

const index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      {/* Componente Carrossel de Fundo */}
      <Carousel images={carouselImages} />
      
      {/* Conteúdo sobreposto ao carrossel */}
      <View className="absolute flex-1 w-full h-full justify-between items-center py-10">
        
        {/* Nome do Aplicativo "Mivick" */}
        <View className="px-6 py-3 bg-gray-800 rounded-full opacity-90 mt-12">
          <Text className="text-[#F85200] text-4xl font-sans-bold-pro tracking-widest">
            Mivick
          </Text>
        </View>

        <View className="mb-4" /> {/* Adiciona um espaço para manter o layout */}

      </View>

      {/* Botões Login e Cadastro (na parte inferior) */}
      <View className="absolute bottom-0 w-full px-8 pb-8 bg-black">
        <FirstButton 
          text="Login" 
          className="bg-[#F85200] mb-4"
          onPress={() => router.push('/login')} 
        />
        <FirstButton 
          text="Cadastro" 
          className="bg-transparent border-2 border-[#F85200]" 
          textClassName="text-[#F85200]" 
          onPress={() => router.push('/cadatro')}
        />
      </View>
    </View>
  );
};

