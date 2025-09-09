import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FirstCard } from '../components/FirstCard/FirstCard';
import { FirstTitle } from '../components/FirstTitle';
import { FirstSubTitle } from '../components/FirstSubTitle';
import { FirstButton } from '../components/FirstButton';
import { styles } from './styleHome1';
import { FirstCarrousel } from '../components/FirstCarrousel/FirstCarrousel';


export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Carrossel no topo */}
      

      {/* Dispositivos Conectados */}
      <FirstTitle text="Dispositivos Conectados" />
      <FirstSubTitle text="Para começar, conecte um dispositivo Mivick." />

      <FirstCard>
        <FirstSubTitle text="Como conectar?" />
        <Text style={styles.cardText}>
          Para conectar, clique no botão abaixo e siga o passo a passo que irá aparecer.
        </Text>
        <FirstButton title="Conectar dispositivo" />
      </FirstCard>

      {/* Contatos Cadastrados */}
      <FirstTitle text="Contatos cadastrados" />

      <FirstCard>
        <Text style={styles.cardText}>
          Você ainda não possui um contato cadastrado.
        </Text>
        <Text style={styles.cardTextSmall}>
          Cadastre um contato para vê-lo aqui.
        </Text>
        <FirstButton title="Cadastrar contato" />
      </FirstCard>

      {/* Histórico */}
      <FirstTitle text="Verifique seu histórico" />
      <FirstSubTitle text="Confira seu histórico de corridas, vias e ruas em que passou, zonas de perigo e etc." />

      <FirstCard>
        <FirstButton title="Histórico do dispositivo" />
      </FirstCard>
    </ScrollView>
  );
}
