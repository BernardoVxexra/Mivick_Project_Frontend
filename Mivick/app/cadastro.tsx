import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Componentes
import { Header } from '@/components/Header';
import { FirstTitle } from '@/components/FirstTitle';
import { FirstTextField } from '@/components/FirstTextField';
import { FirstButton } from '@/components/FirstButton';

import { styles } from './styleCadastro';

export default function Cadastro() {
  const router = useRouter();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <FirstTitle text="Cadastro" />

        <FirstTextField placeholder="Nome" style={{ marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 335, borderRadius: 8, alignSelf: 'center', padding: 12, }} />
        <FirstTextField placeholder="Telefone" style={{ marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 335, borderRadius: 8, alignSelf: 'center', padding: 12, }} />
        <FirstTextField placeholder="Email" style={{  marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 335, borderRadius: 8, alignSelf: 'center', padding: 12, }} />
        <FirstTextField placeholder="Senha" style={{  marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 335, borderRadius: 8, alignSelf: 'center', padding: 12, }} secureTextEntry />
        <FirstTextField placeholder="Confirmar senha" style={{  marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 335, borderRadius: 8, alignSelf: 'center', padding: 12, }} secureTextEntry />

        <FirstButton
          title="Cadastre-se"
          onPress={() => console.log("Cadastro com dados")}
          customStyle={styles.signupButton}
        />

        <View
    style={{
      height: 2,          // espessura da linha
      backgroundColor: '#F85200', // cor laranja
      width: '100%',       // comprimento da linha
      alignSelf: 'center',
      marginVertical: 12, // espaço acima e abaixo da linha
    }}
          />

        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={24} color="#fff" />
          <Text style={styles.googleButtonText}> Cadastre-se com Google</Text>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
  <TouchableOpacity
    style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
    onPress={() => setAgreeToTerms(!agreeToTerms)}
  >
    {agreeToTerms && (
      <FontAwesome name="check" size={16} color="#FFFFFF" />
    )}
  </TouchableOpacity>

  <Text style={styles.checkboxText}>
    Ao clicar, você concorda com os{' '}
    <Text style={styles.termsText}>termos de uso</Text> do aplicativo.
  </Text>
</View>
      </View>
    </View>
  );
}
