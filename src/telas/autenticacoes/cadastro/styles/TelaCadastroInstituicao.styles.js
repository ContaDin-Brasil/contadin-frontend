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
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  mensagemErro: {
    marginTop: 8,
    fontSize: 14,
    color: "#C62828",
    marginBottom: 8,
  },
  botao: {
    backgroundColor: "#2D85F8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  botaoText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
