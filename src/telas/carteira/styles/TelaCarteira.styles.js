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
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    section: {
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
      gap: 8,
    },
    sectionTitleText: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      marginBottom: 2,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: COLORS.textSecondary,
    },
    editButton: {
      backgroundColor: COLORS.secondaryLight,
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    addButton: {
      backgroundColor: COLORS.secondaryLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 10,
      gap: 8,
    },
    addButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export const styles = getStyles(false);
