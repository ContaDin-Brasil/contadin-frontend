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
    formContainer: {
      marginTop: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
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
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    inputComIcone: {
      flex: 1,
      paddingRight: 48,
    },
    eyeButton: {
      position: "absolute",
      right: 12,
      padding: 8,
    },
    labelInline: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.textPrimary,
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 16,
      marginBottom: 8,
    },
    tooltip: {
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    tooltipSeta: {
      position: "absolute",
      top: -6,
      left: 60,
      width: 12,
      height: 12,
      backgroundColor: COLORS.backgroundLight,
      transform: [{ rotate: "45deg" }],
      borderRadius: 2,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: COLORS.border,
    },
    tooltipTitulo: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.textPrimary,
      marginBottom: 8,
    },
    tooltipTexto: {
      fontSize: 12,
      color: COLORS.textSecondary,
      lineHeight: 18,
      marginBottom: 2,
    },
    validacaoContainer: {
      marginTop: 10,
      marginBottom: 4,
      gap: 4,
    },
    validacaoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 2,
    },
    validacaoTexto: {
      fontSize: 13,
      lineHeight: 18,
    },
    validacaoTextoOk: {
      color: COLORS.success,
    },
    validacaoTextoErro: {
      color: COLORS.error,
      fontSize: 13,
    },
    termosContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      gap: 10,
    },
    termosTexto: {
      flex: 1,
      fontSize: 14,
      color: COLORS.textSecondary,
    },
    termosLink: {
      color: COLORS.primaryLight,
      textDecorationLine: "underline",
    },
    termosModalScroll: {
      maxHeight: 360,
    },
    termosModalContent: {
      paddingBottom: 12,
    },
    termosModalTexto: {
      fontSize: 14,
      color: COLORS.textSecondary,
      lineHeight: 20,
    },
    saveButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 24,
    },
    saveButtonText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: "600",
    },
    mensagemErro: {
      marginTop: 12,
      fontSize: 14,
      color: COLORS.error,
    },
    areaGoogle: {
      marginTop: 24,
      alignItems: "center",
    },
    ouConecte: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: 12,
    },
    botaoGoogle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.backgroundLight,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
      gap: 10,
    },
    botaoGoogleText: {
      fontSize: 16,
      color: COLORS.textPrimary,
      fontWeight: "600",
    },
    linkLogin: {
      marginTop: 32,
      fontSize: 16,
      color: COLORS.textPrimary,
      textAlign: "center",
    },
    linkLoginDestaque: {
      color: COLORS.primaryLight,
      textDecorationLine: "underline",
      fontWeight: "600",
    },
  });
};

export const styles = getStyles(false);
