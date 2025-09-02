import React, { useState } from 'react';
import { View, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

interface CarouselProps {
  images: any[];
}

const Carousel = ({ images }: CarouselProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const indicatorActiveColor = '#F85200';
  const indicatorInactiveColor = 'rgba(255, 255, 255, 0.4)';

  return (
    <View className="flex-1 w-full h-full">
      <ImageBackground
        source={images[activeImageIndex]}
        className="w-full h-full"
        resizeMode="cover"
      >
        <View className="absolute w-full h-full bg-black opacity-40" />
      </ImageBackground>

      {/* Indicadores de navegação */}
      <View className="absolute bottom-40 left-0 right-0 flex-row justify-center space-x-2">
        {images.map((_, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.indicator, 
              { backgroundColor: index === activeImageIndex ? indicatorActiveColor : indicatorInactiveColor }
            ]}
            onPress={() => setActiveImageIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export { Carousel };
