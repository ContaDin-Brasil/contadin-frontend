import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoArea: {
    width: 160,
    height: 160,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  botoesContainer: {
    width: "100%",
    maxWidth: 320,
    marginTop: 32,
    gap: 12,
  },
  botaoPrimario: {
    backgroundColor: "#2D85F8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoSecundario: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoPrimarioText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  botaoSecundarioText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
  linkTexto: {
    marginTop: 20,
    fontSize: 16,
    color: "#6BA7FF",
    textDecorationLine: "underline",
  },
  areaGoogle: {
    marginTop: 48,
    alignItems: "center",
  },
  ouConecte: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  botaoGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 10,
  },
  botaoGoogleText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});
