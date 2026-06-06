import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { getColorsByTheme } from '../../../styles/colors';

interface AIProcessingModalProps {
  visible: boolean;
  mode: 'photo' | 'audio' | null;
  statusMessage: string | null;
}

const getTitle = (mode: 'photo' | 'audio' | null): string => {
  if (mode === 'audio') return 'Processando áudio';
  return 'Processando imagem';
};

const getSubtitle = (mode: 'photo' | 'audio' | null): string => {
  if (mode === 'audio') return 'A IA está transcrevendo e extraindo os dados da gravação.';
  return 'A IA está lendo a imagem e montando a transação automaticamente.';
};

const AIProcessingModal: React.FC<AIProcessingModalProps> = ({
  visible,
  mode,
  statusMessage,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.backdrop} />
        <View style={styles.card}>
          <View style={styles.iconRow}>
            <View style={styles.iconBubble}>
              <Ionicons
                name={mode === 'audio' ? 'mic' : 'camera'}
                size={24}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{getTitle(mode)}</Text>
              <Text style={styles.subtitle}>{getSubtitle(mode)}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{statusMessage || 'Preparando processamento...'}</Text>
          </View>
        </View>
      </View>
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
    backdrop: {
      ...StyleSheet.absoluteFillObject,
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
      shadowOpacity: 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
      gap: 20,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    iconBubble: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.backgroundDark,
      borderWidth: 1,
      borderColor: COLORS.primaryLighter,
    },
    titleBlock: {
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
    progressSection: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusBox: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: COLORS.backgroundDark,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    statusText: {
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.textPrimary,
    },
  });
};

export default AIProcessingModal;
