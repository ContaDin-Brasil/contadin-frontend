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
      padding: 30,
      width: "100%",
      alignItems: "center",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 30,
      width: "100%",
      maxWidth: 400,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.textPrimary,
    },
    pinRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pinInput: {
      width: "14.5%",
      minWidth: 38,
      maxWidth: 48,
      height: 52,
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 10,
      fontSize: 22,
      paddingHorizontal: 6,
      textAlign: "center",
      fontWeight: "700",
      color: COLORS.textPrimary,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    linkReenviarText: {
      fontSize: 16,
      color: COLORS.primaryLight,
      textDecorationLine: "underline",
    },
    linkReenviarDisabled: {
      color: COLORS.textTertiary,
    },
    saveButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 10,
    },
    saveButtonText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: "600",
    },
    mensagemErro: {
      fontSize: 14,
      color: COLORS.error,
    },
    infoMessage: {
      fontSize: 14,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 10,
    },
  });
};

export const styles = getStyles(false);
