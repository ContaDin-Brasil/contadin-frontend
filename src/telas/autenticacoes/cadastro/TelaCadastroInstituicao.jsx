import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import TituloPagina from "../../../componentes/TituloPagina";
import InstitutionSelectionModal from "../../../componentes/modais/ModalSelecaoInstituicao";
import AddCustomInstitutionModal from "../../../componentes/modais/ModalAdicionarInstituicao";
import { instituicaoService } from "../../../api";
import { getInstituicoesPadrao } from "../../carteira/constants/instituicoesPadrao";
import { styles } from "./styles/TelaCadastroInstituicao.styles";

function TelaCadastroInstituicao({ navigation, route }) {
  const { user } = route.params || {};
  const userId =
    user && typeof user === "object" && "id" in user ? user.id : null;
  const [selectionVisible, setSelectionVisible] = useState(true);
  const [customVisible, setCustomVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableInstitutions = [
    ...getInstituicoesPadrao("banco"),
    ...getInstituicoesPadrao("vale"),
  ];

  const criarInstituicao = async (dados) => {
    if (!userId) {
      setError("Sessão inválida. Faça login novamente.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await instituicaoService.criar({
        nome: dados.nome,
        icone: dados.icone,
        cor: dados.cor,
        tipoInstituicao: dados.tipoInstituicao,
        fk_usuario: userId,
      });
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao cadastrar instituição.";
      setError(String(msg));
      setLoading(false);
    }
  };

  const handleCloseSelection = () => {
    setSelectionVisible(false);
    navigation.goBack();
  };

  const handleSelectInstitution = (institution) => {
    setSelectionVisible(false);
    criarInstituicao(institution);
  };

  const handleAddCustom = () => {
    setSelectionVisible(false);
    setCustomVisible(true);
  };

  const handleCloseCustom = () => {
    setCustomVisible(false);
    navigation.goBack();
  };

  const handleAddCustomInstitution = (payload) => {
    setCustomVisible(false);
    criarInstituicao(payload);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Cadastre sua Instituição.
      </TituloPagina>

      <View style={styles.contentContainer}>
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2D85F8" />
            <Text style={styles.loadingText}>Salvando...</Text>
          </View>
        )}
        {error ? (
          <>
            <Text style={styles.mensagemErro}>{error}</Text>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => {
                setError(null);
                setSelectionVisible(true);
              }}
            >
              <Text style={styles.botaoText}>Tentar novamente</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      <InstitutionSelectionModal
        visible={selectionVisible}
        onClose={handleCloseSelection}
        onSelectInstitution={handleSelectInstitution}
        onAddCustom={handleAddCustom}
        availableInstitutions={availableInstitutions}
      />

      <AddCustomInstitutionModal
        visible={customVisible}
        onClose={handleCloseCustom}
        onAdd={handleAddCustomInstitution}
        tipoInicial="banco"
      />
    </SafeAreaView>
  );
}

export default TelaCadastroInstituicao;
