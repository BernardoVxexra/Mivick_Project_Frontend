import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    width: '100%',
    height: '85%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.4,
  },

indicatorsContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 12,
  
},
indicator: {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginHorizontal: 6,
},

});
