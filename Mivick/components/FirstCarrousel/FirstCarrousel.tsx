import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity } from 'react-native';
import { styles } from '../FirstCarrousel/styleCarrousel';

interface CarouselProps {
  images: any[];
}

export function FirstCarrousel({ images }: CarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const indicatorActiveColor = '#FF4500';
  const indicatorInactiveColor = 'rgba(255, 255, 255, 0.4)';

  // Timer para trocar imagem a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Garante sempre 3 pontos
  const indicators = [0, 1, 2];

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
        {indicators.map((_, index) => (
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