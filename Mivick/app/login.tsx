import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Importando os componentes
import { Header } from '@/components/Header/index';
import { FirstTitle } from '@/components/FirstTitle/index';
import { FirstTextField } from '@/components/FirstTextField/index';
import { FirstButton } from '@/components/FirstButton/index';
import "./global.css";

const login = () => {
  const router = useRouter();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <View className="flex-1 bg-black">
      {/* Header com a logo */}
      <Header />

      <View className="p-8">
        {/* Título "Login" */}
        <FirstTitle text="Login" className="mt-8 mb-4" />

        {/* Campos de Input */}
        <FirstTextField placeholder="Nome" />
        <FirstTextField placeholder="Senha" className="mt-4" secureTextEntry />

        {/* Link "Esqueceu a senha" */}
        <TouchableOpacity className="self-end mt-2">
          <Text className="text-[#F85200] font-sans-regular-pro text-base">
            Esqueceu a senha
          </Text>
        </TouchableOpacity>

        {/* Botão de Login principal */}
        <FirstButton text="Login" className="bg-[#F85200] mt-8 mb-4" onPress={() => console.log("Login com nome e senha")} />

        {/* Botão de "Login com Google" */}
        <TouchableOpacity className="flex-row items-center justify-center p-4 bg-gray-700 rounded-lg">
          <FontAwesome name="google" size={24} color="#fff" />
          <Text className="text-white text-lg font-sans-regular-pro">
            G
          </Text>
          <Text className="ml-2 text-white font-sans-regular-pro text-lg">
            Login com Google
          </Text>
        </TouchableOpacity>

        {/* Checkbox e Termos de Uso */}
        <View className="flex-row items-center mt-4">
          <TouchableOpacity
            className={`w-6 h-6 rounded border-2 ${agreeToTerms ? 'bg-[#F85200] border-[#F85200]' : 'border-white'}`}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          />
          <Text className="ml-2 text-white font-sans-regular-pro text-sm">
            Ao clicar, você concorda com os 
            <Text className="text-[#F85200]">
              termos de uso
            </Text>
            do aplicativo.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default login;
