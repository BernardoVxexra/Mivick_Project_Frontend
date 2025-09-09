// components/FirstCarrousel.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  ImageSourcePropType,
  Text,
} from 'react-native';
import { styles } from './styleCarrousel';

interface CarouselProps {
  images: ImageSourcePropType[];   // agora obrigatório
  autoPlayInterval?: number;       // opcional
}

export function FirstCarrousel({ images, autoPlayInterval = 5000 }: CarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // autoplay
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [images?.length, autoPlayInterval]);

  if (!images || images.length === 0) {
    return (
      <View style={[styles.carouselContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Sem imagens</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <ImageBackground
        source={images[activeImageIndex]}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Indicadores */}
        <View style={styles.indicatorsWrapper}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === activeImageIndex
                  ? { backgroundColor: '#FF4500' }
                  : { backgroundColor: 'rgba(255,255,255,0.35)' },
              ]}
              onPress={() => setActiveImageIndex(index)}
              activeOpacity={0.8}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}
