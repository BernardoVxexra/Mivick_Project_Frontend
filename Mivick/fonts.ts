
import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'SansBoldPro': require('../../assets/fonts/SourceSans3-Bold.ttf'),
  });

  return fontsLoaded;
};
