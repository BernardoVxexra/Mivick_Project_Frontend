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

        <FirstTextField placeholder="Nome" />
        <FirstTextField placeholder="Telefone" style={{ marginTop: 16 }} />
        <FirstTextField placeholder="Email" style={{ marginTop: 16 }} />
        <FirstTextField placeholder="Senha" style={{ marginTop: 16 }} secureTextEntry />
        <FirstTextField placeholder="Confirmar senha" style={{ marginTop: 16 }} secureTextEntry />

        <FirstButton
          title="Cadastre-se"
          onPress={() => console.log("Cadastro com dados")}
          customStyle={styles.signupButton}
        />

        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={24} color="#fff" />
          <Text style={styles.googleButtonText}> Cadastre-se com Google</Text>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              agreeToTerms && styles.checkboxChecked
            ]}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          />
          <Text style={styles.checkboxText}>
            Ao clicar, você concorda com os{' '}
            <Text style={styles.termsText}>termos de uso</Text> do aplicativo.
          </Text>
        </View>
      </View>
    </View>
  );
}
