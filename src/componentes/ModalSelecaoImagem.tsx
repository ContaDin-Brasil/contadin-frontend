/**
 * Modal Bottom Sheet para seleção de câmera ou galeria
 * Abre de baixo ocupando até 35% da tela
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';

interface ModalSelecaoImagemProps {
  visible: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');
const MODAL_HEIGHT = screenHeight * 0.40; // 35% da tela

export const ModalSelecaoImagem: React.FC<ModalSelecaoImagemProps> = ({
  visible,
  onCamera,
  onGallery,
  onCancel,
  isLoading = false,
}) => {
  const [translateY] = useState(new Animated.Value(MODAL_HEIGHT));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: MODAL_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const handleCamera = () => {
    if (!isLoading) {
      onCamera();
    }
  };

  const handleGallery = () => {
    if (!isLoading) {
      onGallery();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Overlay com toque para fechar */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      />

      {/* Modal Bottom Sheet */}
      <Animated.View
        style={[
          styles.modal,
          { transform: [{ translateY }] },
        ]}
      >
        <SafeAreaView style={styles.container}>
          {/* Indicador de arrastar */}
          <View style={styles.indicator} />

          {/* Título */}
          <Text style={styles.title}>Adicionar Imagem</Text>

          {/* Botão Câmera */}
          <TouchableOpacity
            style={[styles.buttonWrapper, isLoading && styles.buttonDisabled]}
            onPress={handleCamera}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="camera"
                size={24}
                color={COLORS.primary}
              />
              <View style={styles.buttonTextWrapper}>
                <Text style={styles.buttonTitle}>Câmera</Text>
                <Text style={styles.buttonDescription}>
                  Tirar uma foto da câmera
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>

          {/* Botão Galeria */}
          <TouchableOpacity
            style={[styles.buttonWrapper, isLoading && styles.buttonDisabled]}
            onPress={handleGallery}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="images"
                size={24}
                color={COLORS.primary}
              />
              <View style={styles.buttonTextWrapper}>
                <Text style={styles.buttonTitle}>Galeria</Text>
                <Text style={styles.buttonDescription}>
                  Selecionar uma imagem
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>

          {/* Botão Cancelar */}
          <TouchableOpacity
            style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
            onPress={onCancel}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    height: MODAL_HEIGHT,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  buttonTextWrapper: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  buttonDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
