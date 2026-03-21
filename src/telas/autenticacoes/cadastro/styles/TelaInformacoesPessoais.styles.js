import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    color: "#333",
  },
  input: {
    backgroundColor: "#E0E0E0",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#2D85F8",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  mensagemErro: {
    marginTop: 12,
    fontSize: 14,
    color: "#C62828",
  },
});
