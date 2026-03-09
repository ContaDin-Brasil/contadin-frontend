import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 48,
  },
  pergunta: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 32,
  },
  botao: {
    backgroundColor: "#2D85F8",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
