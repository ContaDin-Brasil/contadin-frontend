import { StyleSheet } from "react-native";
import { COLORS } from "../../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  mensagemSucesso: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: COLORS.tooltip,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    maxWidth: 280,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
