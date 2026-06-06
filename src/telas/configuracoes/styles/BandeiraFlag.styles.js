import { StyleSheet } from 'react-native';
import { getColorsByTheme } from '../../../styles/colors';

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      overflow: 'hidden',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
  });
};

export const styles = getStyles(false);