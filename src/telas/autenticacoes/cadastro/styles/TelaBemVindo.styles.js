import { StyleSheet } from "react-native";
import { COLORS } from "../../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 48,
  },
  pergunta: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 32,
  },
  botao: {
    backgroundColor: COLORS.tooltip,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
