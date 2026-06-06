import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import TituloPagina from "../../../componentes/TituloPagina";
import { useInformacoesPessoais } from "./hooks/useInformacoesPessoais";
import { formatarTelefone } from "../../../utils/mascaraTelefone";
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorsByTheme } from "../../../styles/colors";
import { getStyles } from "./styles/TelaInformacoesPessoais.styles";

function TelaInformacoesPessoais({ navigation, route }) {
  const cadastro = route.params?.cadastro;
  const info = useInformacoesPessoais(cadastro);
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  const onContinuar = async () => {
    await info.handleContinuar(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Adicione suas informações para começarmos
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={info.nome}
            onChangeText={info.setNome}
            placeholder=""
            editable={!info.loading}
          />

          <Text style={styles.label}>Sobrenome</Text>
          <TextInput
            style={styles.input}
            value={info.sobrenome}
            onChangeText={info.setSobrenome}
            placeholder=""
            editable={!info.loading}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={info.telefone}
            onChangeText={(t) => info.setTelefone(formatarTelefone(t))}
            placeholder="(11) 93843-3432"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="phone-pad"
            editable={!info.loading}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onContinuar}
            disabled={info.loading}
          >
            <Text style={styles.saveButtonText}>
              {info.loading ? "Salvando..." : "Continuar"}
            </Text>
          </TouchableOpacity>

          {info.error ? (
            <Text style={styles.mensagemErro}>{info.error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaInformacoesPessoais;
