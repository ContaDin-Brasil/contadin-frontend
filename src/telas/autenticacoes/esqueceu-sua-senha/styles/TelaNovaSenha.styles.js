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
  instrucao: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    lineHeight: 22,
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
  requirementsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  requirementText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
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
