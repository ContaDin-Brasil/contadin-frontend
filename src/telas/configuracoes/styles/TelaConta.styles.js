import { StyleSheet } from 'react-native';
import { getColorsByTheme } from '../../../styles/colors';

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingTop: 20,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 100,
    },
    buttonsContainer: {
      marginTop: 20,
    },
    modalContent: {
      marginVertical: 10,
    },
    bulletPoint: {
      fontSize: 15,
      color: COLORS.textPrimary,
      marginBottom: 12,
      lineHeight: 20,
    },
    modalQuestion: {
      fontSize: 16,
      color: COLORS.textPrimary,
      marginTop: 10,
      fontWeight: '500',
    },
    modalText: {
      fontSize: 16,
      color: COLORS.textPrimary,
      marginBottom: 16,
    },
    boldText: {
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: COLORS.border,
      padding: 16,
      borderRadius: 8,
      fontSize: 16,
      marginTop: 8,
    },
  });
};

export const styles = getStyles(false);
