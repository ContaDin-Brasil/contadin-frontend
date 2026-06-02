import { StyleSheet } from "react-native";
import { getColorsByTheme } from "../../../../styles/colors";

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
    loadingWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
      color: COLORS.textSecondary,
    },
    mensagemErro: {
      marginTop: 8,
      fontSize: 14,
      color: COLORS.error,
      marginBottom: 8,
    },
    botao: {
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    botaoText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: "600",
    },
  });
};

export const styles = getStyles(false);
