/**
 * Componente para exibir preview de imagem capturada
 */

import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColorsByTheme } from '../styles/colors';
import { useTheme } from '../contexts/ThemeContext';

interface ImagePreviewProps {
  imageUri: string;
  onRemove?: () => void;
  size?: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  onRemove,
  size = 150,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { width: size, height: size }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Ionicons name="close-circle" size={32} color={COLORS.primaryLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: 12,
    },
    imageContainer: {
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: COLORS.backgroundLight,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    removeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

const styles = getStyles(false);
export default ImagePreview;
