import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: width * 0.45,   // 25% da largura da tela
    aspectRatio: 1,        // mantém proporção quadrada
    resizeMode: 'contain', // garante que a imagem inteira apareça
  },
});
