import React, { useState } from 'react';
import { View, ImageBackground, TouchableOpacity } from 'react-native';
import { styles } from '../FirstCarrousel/styleCarrousel';

interface CarouselProps {
  images: any[];
}

export function FirstCarrousel({ images }: CarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const indicatorActiveColor = '#FF4500'; // cor ativa (laranja, ex. primary)
  const indicatorInactiveColor = 'rgba(255, 255, 255, 0.4)';

  return (
    <View style={styles.carouselContainer}>
      <ImageBackground
        source={images[activeImageIndex]}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      {/* Indicadores de navegação */}
      <View style={styles.indicatorsContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === activeImageIndex
                    ? indicatorActiveColor
                    : indicatorInactiveColor,
              },
            ]}
            onPress={() => setActiveImageIndex(index)}
          />
        ))}
      </View>
    </View>
  );
}
