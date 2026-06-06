import { StyleSheet } from 'react-native';
import { getColorsByTheme } from '../../../styles/colors';

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    headerHandleSearchExpanded: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 10,
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 20,
    },
    searchButton: {
      padding: 4,
      paddingRight: 20,
    },
    searchIconExpanded: {
      marginRight: 10,
    },
    searchInputExpanded: {
      flex: 1,
      fontSize: 18,
      color: COLORS.textPrimary,
    },
    typeToggle: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 15,
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 10,
    },
    toggleButtonActive: {
      backgroundColor: COLORS.primaryLighter,
    },
    toggleButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: COLORS.textSecondary,
    },
    toggleButtonTextActive: {
      color: COLORS.textPrimary,
      fontWeight: '600',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 90,
    },
    categoriaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    categoriaInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    categoriaIcone: {
      width: 45,
      height: 45,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoriaNome: {
      fontSize: 16,
      fontWeight: '500',
      color: COLORS.textPrimary,
    },
    categoriaBadge: {
      fontSize: 11,
      color: COLORS.textTertiary,
      marginTop: 2,
      fontWeight: '400',
    },
    categoriaActions: {
      flexDirection: 'row',
      gap: 10,
    },
    actionButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    errorText: {
      fontSize: 16,
      color: COLORS.error,
      textAlign: 'center',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: COLORS.textTertiary,
      marginTop: 10,
    },
  });
};

export const styles = getStyles(false);
