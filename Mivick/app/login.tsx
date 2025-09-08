import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Componentes
import { Header } from '@/components/Header';
import { FirstTitle } from '@/components/FirstTitle';
import { FirstTextField } from '@/components/FirstTextField';
import { FirstButton } from '@/components/FirstButton';

import { styles } from './styleLogin';

export default function Login() {
  const router = useRouter();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <View style={styles.container}>
      <Header/>

      <View style={styles.content}>
        <FirstTitle text="Login"  />

        <FirstTextField placeholder="Nome" style={{ marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 375, borderRadius: 8, alignSelf: 'center', padding: 12,}} />
        <FirstTextField placeholder="Senha" secureTextEntry style={{ marginTop: 25 , backgroundColor: '#FFFFFF' , height: 50 , width: 375, borderRadius: 8, alignSelf: 'center', padding: 12,}} />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha</Text>
        </TouchableOpacity>

        <FirstButton
          title="Login"
          onPress={() => console.log("Login com nome e senha")}
          customStyle={styles.loginButton}
        />

        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={24} color="#fff" />
          <Text style={styles.googleButtonText}> Login com Google</Text>
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
