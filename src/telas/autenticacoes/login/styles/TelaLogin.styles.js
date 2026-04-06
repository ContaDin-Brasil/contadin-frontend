import { StyleSheet } from "react-native";
import { COLORS } from "../../../../styles/colors";

export const styles = StyleSheet.create({
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
    backgroundColor: COLORS.border,
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
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
  saveButton: {
    backgroundColor: COLORS.tooltip,
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
  linkTexto: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primaryLight,
    textDecorationLine: "underline",
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
  linkCadastro: {
    marginTop: 32,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  linkCadastroDestaque: {
    color: COLORS.primaryLight,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
