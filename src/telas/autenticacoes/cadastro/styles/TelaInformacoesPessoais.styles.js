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
  mensagemErro: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.error,
  },
});
