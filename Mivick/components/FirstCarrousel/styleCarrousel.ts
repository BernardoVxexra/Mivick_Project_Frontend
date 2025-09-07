import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.4,
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
