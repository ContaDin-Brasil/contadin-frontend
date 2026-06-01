import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TituloPagina from "../../../componentes/TituloPagina";
import { useEsqueceuSenha } from "./hooks/useEsqueceuSenha";
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorsByTheme } from "../../../styles/colors";
import { getStyles } from "./styles/TelaSolicitarEmail.styles";

function TelaSolicitarEmail({ navigation }) {
  const esqueceu = useEsqueceuSenha();
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  const onEnviarCodigo = async () => {
    const success = await esqueceu.handleEnviarCodigo();
    if (success) {
      navigation.navigate("ValidarToken", { email: esqueceu.email.trim() });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Sem problemas! Vamos <Text style={{ fontWeight: "bold" }}>resetar</Text>{" "}
        a sua Senha!
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.instrucao}>
            Insira abaixo, o e-mail que utilizou para criar a conta.
          </Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={esqueceu.email}
            onChangeText={esqueceu.setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!esqueceu.loading}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onEnviarCodigo}
            disabled={esqueceu.loading}
          >
            <Ionicons name="mail-outline" size={24} color={COLORS.white} />
            <Text style={styles.saveButtonText}>
              {esqueceu.loading ? "Enviando..." : "Enviar Código"}
            </Text>
          </TouchableOpacity>
          {esqueceu.error ? (
            <Text style={styles.mensagemErro}>{esqueceu.error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaSolicitarEmail;
