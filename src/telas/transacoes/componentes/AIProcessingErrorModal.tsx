import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { getColorsByTheme } from '../../../styles/colors';
import type { ProcessingFeedbackError } from '../hooks/useProcessamentoIA';

interface AIProcessingErrorModalProps {
  visible: boolean;
  error: ProcessingFeedbackError | null;
  onClose: () => void;
  onRetry: () => void;
}

const AIProcessingErrorModal: React.FC<AIProcessingErrorModalProps> = ({
  visible,
  error,
  onClose,
  onRetry,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  if (!visible || !error) return null;

  const canRetry = error.retryable;
  const displayMessage =
    error.kind === 'validation' && error.source === 'photo'
      ? 'Não foi reconhecido nenhum dado financeiro na imagem. Tente novamente com uma foto mais nítida ou com mais informações visíveis.'
      : error.message;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.iconBubble}>
              <Ionicons name="alert-circle" size={26} color={COLORS.error} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{error.title}</Text>
              <Text style={styles.subtitle}>{displayMessage}</Text>
            </View>
          </View>

          {error.details ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>{error.details}</Text>
            </View>
          ) : null}

          <View style={styles.buttonsRow}>
            {canRetry ? (
              <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.closeButton, !canRetry && styles.closeButtonFullWidth]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeText}>{canRetry ? 'Fechar' : 'Ok'}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: COLORS.overlay,
    },
    card: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 24,
      padding: 24,
      backgroundColor: COLORS.backgroundLight,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
      gap: 20,
    },
    header: {
      flexDirection: 'row',
      gap: 14,
      alignItems: 'flex-start',
    },
    iconBubble: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.backgroundDark,
      borderWidth: 1,
      borderColor: COLORS.error,
    },
    headerText: {
      flex: 1,
      gap: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.textSecondary,
    },
    detailsContainer: {
      borderRadius: 12,
      padding: 12,
      backgroundColor: COLORS.backgroundDark,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    detailsText: {
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.textSecondary,
    },
    buttonsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    retryButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
      backgroundColor: COLORS.error,
    },
    retryText: {
      fontSize: 15,
      fontWeight: '700',
      color: COLORS.white,
    },
    closeButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
      backgroundColor: COLORS.backgroundDark,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    closeButtonFullWidth: {
      flex: 1,
    },
    closeText: {
      fontSize: 15,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
  });
};

export default AIProcessingErrorModal;
