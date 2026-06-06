import { StyleSheet } from "react-native";
import { getColorsByTheme, addOpacity } from "../../../../styles/colors";

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingTop: 20,
    },
    overlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: COLORS.backgroundLight,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "75%",
      paddingBottom: 24,
    },
    modalContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    modalScrollContent: {
      paddingBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: COLORS.textPrimary,
      marginBottom: 20,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 24,
    },
    bankCard: {
      width: "22%",
      aspectRatio: 0.9,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: COLORS.border,
      backgroundColor: COLORS.backgroundLight,
      padding: 6,
    },
    bankCardSelected: {
      borderColor: COLORS.primary,
      backgroundColor: isDarkMode ? addOpacity(COLORS.primary, 14) : COLORS.primaryLighter,
    },
    bankCardIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 4,
      overflow: "hidden",
    },
    bankLogo: {
      width: 38,
      height: 38,
      borderRadius: 8,
    },
    bankIconText: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.white,
    },
    bankName: {
      fontSize: 10,
      fontWeight: "600",
      color: COLORS.textPrimary,
      textAlign: "center",
    },
    linkAdicionar: {
      marginBottom: 20,
      alignItems: "center",
    },
    linkAdicionarText: {
      fontSize: 15,
      color: COLORS.textPrimary,
    },
    linkAdicionarBold: {
      fontWeight: "700",
      color: COLORS.primary,
    },
    selecionarButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 14,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      paddingHorizontal: 40,
    },
    selecionarButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: "600",
    },
    mensagemErro: {
      marginTop: 12,
      fontSize: 14,
      color: COLORS.error,
      textAlign: "center",
    },
  });
};

export const styles = getStyles(false);
