import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 24,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  bankCard: {
    width: "22%",
    aspectRatio: 0.9,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    padding: 6,
  },
  bankCardSelected: {
    borderColor: "#2D85F8",
    backgroundColor: "rgba(107, 167, 255, 0.1)",
  },
  bankCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    overflow: "hidden",
  },
  bankLogo: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  bankIconText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  bankName: {
    fontSize: 10,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  linkAdicionar: {
    marginBottom: 20,
    alignItems: "center",
  },
  linkAdicionarText: {
    fontSize: 15,
    color: "#333",
  },
  linkAdicionarBold: {
    fontWeight: "700",
    color: "#000",
  },
  selecionarButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 40,
  },
  selecionarButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  mensagemErro: {
    marginTop: 12,
    fontSize: 14,
    color: "#C62828",
    textAlign: "center",
  },
});
