import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FirstCard } from '../components/FirstCard/FirstCard';
import { FirstTitle } from '../components/FirstTitle';
import { useRouter } from 'expo-router';
import { FirstSubTitle } from '../components/FirstSubTitle';
import { FirstButton } from '../components/FirstButton';
import { styles } from './styleHome1';
import { FirstCarrousel } from '../components/FirstCarrousel/FirstCarrousel';
import { HeaderComLogin } from '../components/HeaderComLogin'; // 🔥 import do header
import { FontAwesome } from '@expo/vector-icons';


const carouselImages = [
  require('../assets/images/primeira-bike1.jpg'),
  require('../assets/images/segundo.webp'),
  require('../assets/images/terceira.jpg')
];
  const router = useRouter();

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Header fixo no topo */}
      <HeaderComLogin />

      {/* Conteúdo rolável */}
      <ScrollView style={styles.container}>
        {/* Carrossel no topo */}
        <FirstCarrousel images={carouselImages} />
        

        {/* Dispositivos Conectados */}
        <FirstTitle text="Dispositivos Conectados" />
        <FirstSubTitle text="Para começar, conecte um dispositivo Mivick." />

        <FirstCard>
          <FontAwesome name="wifi" size={20} color="#FF4500" style={{ marginRight: 6 }} />
          <FirstSubTitle text="Como conectar?" />
          <Text style={styles.cardText}>
            Para conectar, clique no botão abaixo e siga o passo a passo que irá aparecer.
          </Text>
          <FirstButton title="Conectar dispositivo" />
        </FirstCard>

                <View
                    style={{
                      height: 2,          // espessura da linha
                      backgroundColor: '#F85200', // cor laranja
                      width: '100%',       // comprimento da linha
                      alignSelf: 'center',
                      marginVertical: 12, // espaço acima e abaixo da linha
                    }}
                          />

        {/* Contatos Cadastrados */}
        <FirstTitle text="Contatos cadastrados" />
        <FirstCard>
          <Text style={styles.cardText}>
            Você ainda não possui um contato cadastrado.
          </Text>
          <Text style={styles.cardTextSmall}>
            Cadastre um contato para vê-lo aqui.
          </Text>
          <FirstButton title="Cadastrar contato"  onPress={() => router.push('/cadastrarContato')} />
        </FirstCard>

                <View
                    style={{
                      height: 2,          // espessura da linha
                      backgroundColor: '#F85200', // cor laranja
                      width: '100%',       // comprimento da linha
                      alignSelf: 'center',
                      marginVertical: 12, // espaço acima e abaixo da linha
                    }}
                          />

      

        <FirstCard>
            {/* Histórico */}
        <FirstTitle text="Verifique seu histórico" />
        <FirstSubTitle text="Confira seu histórico de corridas, vias e ruas em que passou, zonas de perigo e etc." />
          <FirstButton title="Histórico do dispositivo" />
        </FirstCard>
      </ScrollView>
    </View>
  );
}
