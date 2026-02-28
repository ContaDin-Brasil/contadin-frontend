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
    backgroundColor: "#6BA7FF",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  linkTexto: {
    marginTop: 16,
    fontSize: 16,
    color: "#6BA7FF",
    textDecorationLine: "underline",
  },
  mensagemErro: {
    marginTop: 12,
    fontSize: 14,
    color: "#C62828",
  },
  areaGoogle: {
    marginTop: 24,
    alignItems: "center",
  },
  ouConecte: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  iconeGoogle: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  linkCadastro: {
    marginTop: 32,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  linkCadastroDestaque: {
    color: "#6BA7FF",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
