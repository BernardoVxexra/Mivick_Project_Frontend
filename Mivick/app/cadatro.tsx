import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Importando os componentes
import { Header } from '@/components/Header/index';
import { FirstTitle } from '@/components/FirstTitle/index';
import { FirstTextField } from '@/components/FirstTextField/index';
import { FirstButton } from '@/components/FirstButton/index';
import "./global.css";

const CadastroScreen = () => {
  const router = useRouter();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <View className="flex-1 bg-black">
      {/* Header com a logo */}
      <Header />

      <View className="p-8">
        {/* Título "Cadastro" */}
        <FirstTitle text="Cadastro" className="mt-8 mb-4" />

        {/* Campos de Input */}
        <FirstTextField placeholder="Nome" />
        <FirstTextField placeholder="Telefone" className="mt-4" />
        <FirstTextField placeholder="Email" className="mt-4" />
        <FirstTextField placeholder="Senha" className="mt-4" secureTextEntry />
        <FirstTextField placeholder="Confirmar senha" className="mt-4" secureTextEntry />

        {/* Botão de Cadastro principal */}
        <FirstButton text="Cadastre-se" className="bg-[#F85200] mt-8 mb-4" onPress={() => console.log("Cadastro com dados")} />

        {/* Botão de "Cadastre-se com Google" */}
        <TouchableOpacity className="flex-row items-center justify-center p-4 bg-gray-700 rounded-lg">
          <Text className="text-white text-lg font-sans-regular-pro">
            G
          </Text>
          <Text className="ml-2 text-white font-sans-regular-pro text-lg">
            Cadastre-se com Google
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

export default CadastroScreen;
