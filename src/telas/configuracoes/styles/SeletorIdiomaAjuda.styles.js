import { StyleSheet } from 'react-native';
import { getColorsByTheme } from '../../../styles/colors';

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    seletor: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: COLORS.backgroundLight,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 4,
    },
    overlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    modal: {
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 16,
      paddingVertical: 16,
      maxHeight: '70%',
    },
    modalTitulo: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.textPrimary,
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      gap: 12,
    },
    opcaoSelecionada: {
      backgroundColor: COLORS.primaryLighter,
    },
    opcaoTexto: {
      flex: 1,
      fontSize: 16,
      color: COLORS.textPrimary,
    },
    opcaoTextoSelecionado: {
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
  });
};

export const styles = getStyles(false);