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
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  botoesContainer: {
    width: "100%",
    maxWidth: 320,
    marginTop: 32,
    gap: 12,
  },
  botaoPrimario: {
    backgroundColor: "#6BA7FF",
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
    color: "#000",
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
  iconeGoogle: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
