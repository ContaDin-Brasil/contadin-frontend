import { StyleSheet } from 'react-native';
import { FOOTER_HEIGHT } from '../../../componentes/BotoesAcaoFixo';
import { getColorsByTheme } from '../../../styles/colors';

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingTop: 20,
    },
    screen: {
      flex: 1,
    },
    scroll: {
      flex: 1,
      marginBottom: FOOTER_HEIGHT,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
      color: COLORS.textPrimary,
      fontWeight: '500',
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    formContainer: {
      marginTop: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.textPrimary,
      marginTop: 4,
      marginBottom: 6,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginTop: 26,
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      marginTop: 16,
      color: COLORS.textPrimary,
    },
    input: {
      backgroundColor: COLORS.backgroundLight,
      padding: 16,
      borderRadius: 8,
      fontSize: 16,
      color: COLORS.textPrimary,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    impactText: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 18,
      color: COLORS.textSecondary,
      fontWeight: '500',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 8,
    },
    switchLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: COLORS.textPrimary,
    },
    saveButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 32,
    },
    saveButtonDisabled: {
      opacity: 0.8,
    },
    saveButtonText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: '600',
    },
  });
};

// Manter para compatibilidade (usar light theme por padrão)
export const styles = getStyles(false);
