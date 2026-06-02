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
    instrucao: {
      fontSize: 16,
      color: COLORS.textPrimary,
      marginBottom: 16,
      lineHeight: 22,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 8,
      marginTop: 16,
      color: COLORS.textPrimary,
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
  });
};

export const styles = getStyles(false);
