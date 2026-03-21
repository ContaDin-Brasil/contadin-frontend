import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    color: "#333",
  },
  pinRow: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  pinInput: {
    width: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    fontSize: 22,
    padding: 10,
    textAlign: "center",
    fontWeight: "700",
    color: "#333",
  },
  linkReenviarText: {
    fontSize: 16,
    color: "#6BA7FF",
    textDecorationLine: "underline",
  },
  linkReenviarDisabled: {
    color: "#999",
  },
  saveButton: {
    backgroundColor: "#2D85F8",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  mensagemErro: {
    fontSize: 14,
    color: "#C62828",
  },
});
