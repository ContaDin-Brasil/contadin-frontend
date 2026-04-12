import { StyleSheet } from "react-native";
import { COLORS } from "../../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoArea: {
    width: 160,
    height: 160,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  botoesContainer: {
    width: "100%",
    maxWidth: 320,
    marginTop: 32,
    gap: 12,
  },
  botaoPrimario: {
    backgroundColor: COLORS.tooltip,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoSecundario: {
    backgroundColor: COLORS.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoPrimarioText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  botaoSecundarioText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  linkTexto: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.primaryLight,
    textDecorationLine: "underline",
  },
  areaGoogle: {
    marginTop: 48,
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
    backgroundColor: COLORS.white,
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
});
