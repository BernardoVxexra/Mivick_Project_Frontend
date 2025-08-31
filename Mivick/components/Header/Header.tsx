import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline'; // Exemplo de ícone

const Header = () => {
  return (
    <View className="flex-row justify-between items-center p-4">
      <TouchableOpacity>
        <ArrowLeftIcon size={24} color="#F85200" />
      </TouchableOpacity>
      <Text className="text-xl font-sans-bold-pro text-white">Mivick</Text>
      <View className="w-6" /> {/* Espaço vazio para manter o alinhamento */}
    </View>
  );
};

export { Header };