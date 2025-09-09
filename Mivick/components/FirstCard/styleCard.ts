import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#2D2D2D', // cor de card da sua paleta
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,

    // sombra para destacar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android
  },
});
