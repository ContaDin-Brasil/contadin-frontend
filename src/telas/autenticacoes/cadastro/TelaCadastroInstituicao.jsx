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
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorsByTheme } from "../../../styles/colors";
import { getStyles } from "./styles/TelaCadastroInstituicao.styles";
import {
  extrairUsuarioId,
  obterUsuarioIdOuErro,
  normalizarTipoInstituicaoDaEntidade,
} from "../../../utils/normalizacao";

function TelaCadastroInstituicao({ navigation, route }) {
  const { user } = route.params || {};
  const userId = extrairUsuarioId(user);
  const [selectionVisible, setSelectionVisible] = useState(true);
  const [customVisible, setCustomVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  const availableInstitutions = [
    ...getInstituicoesPadrao("banco"),
    ...getInstituicoesPadrao("vale"),
  ];

  const criarInstituicao = async (dados) => {
    const userIdValido = obterUsuarioIdOuErro(userId, (message) => setError(message));
    if (!userIdValido) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const type = normalizarTipoInstituicaoDaEntidade(dados);

      await instituicaoService.criar({
        nome: dados.nome,
        icone: dados.icone,
        cor: dados.cor,
        type,
        fkUsuario: userIdValido,
        ativo: true,
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
            <ActivityIndicator size="large" color={COLORS.primary} />
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
