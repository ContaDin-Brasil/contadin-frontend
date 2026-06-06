import { StyleSheet } from "react-native";
import { getColorsByTheme, addOpacity } from "../../../../styles/colors";

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    iconeSucesso: {
      marginBottom: 24,
    },
    textoSucesso: {
      fontSize: 22,
      fontWeight: "bold",
      color: COLORS.textPrimary,
      textAlign: "center",
      marginBottom: 48,
    },
    botaoContinuar: {
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      minWidth: 240,
      alignItems: "center",
      justifyContent: "center",
    },
    botaoContinuarText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: "600",
    },
    botaoImportar: {
      marginTop: 14,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      backgroundColor: isDarkMode ? addOpacity(COLORS.primary, 10) : COLORS.primaryLighter,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      minWidth: 240,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botaoImportarText: {
      color: COLORS.primary,
      fontSize: 15,
      fontWeight: '600',
    },
  });
};

export const styles = getStyles(false);
