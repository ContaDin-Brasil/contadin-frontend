import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TituloPagina from "../../../componentes/TituloPagina";
import { useCriarConta } from "./hooks/useCriarConta";
import { REQUISITOS_SENHA } from "../../configuracoes/constants/constantesConfiguracao";
import {
  obterResultadosValidacaoSenha,
  verificarSenhasConferem,
} from "../../../utils/senhaUtils";
import { styles } from "./styles/TelaCriarConta.styles";

function TelaCriarConta({ navigation }) {
  const criar = useCriarConta();
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [tooltipVisivel, setTooltipVisivel] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);

  const resultadosValidacao = useMemo(
    () => obterResultadosValidacaoSenha(criar.senha),
    [criar.senha],
  );

  const todasValidas = resultadosValidacao.every((r) => r.valido);
  const senhasConferem = verificarSenhasConferem(
    criar.senha,
    criar.confirmarSenha,
  );

  const onCadastrar = async () => {
    await criar.handleCadastrar(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Crie sua conta
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={criar.email}
            onChangeText={criar.setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!criar.loading}
          />

          <View style={styles.labelRow}>
            <Text style={styles.labelInline}>Senha</Text>
            <TouchableOpacity
              onPress={() => setTooltipVisivel((v) => !v)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={tooltipVisivel ? "#2D85F8" : "#999"}
              />
            </TouchableOpacity>
          </View>

          {tooltipVisivel && (
            <View style={styles.tooltip}>
              <View style={styles.tooltipSeta} />
              <Text style={styles.tooltipTitulo}>Requisitos da senha:</Text>
              {REQUISITOS_SENHA.map((req, i) => (
                <Text key={i} style={styles.tooltipTexto}>
                  • {req}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputComIcone]}
              value={criar.senha}
              onChangeText={criar.setSenha}
              secureTextEntry={!showSenha}
              placeholder=""
              editable={!criar.loading}
              onBlur={() => setSenhaTocada(true)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowSenha((s) => !s)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showSenha ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {senhaTocada && criar.senha.length > 0 && !todasValidas && (
            <View style={styles.validacaoContainer}>
              {resultadosValidacao.map((r, i) => (
                <View key={i} style={styles.validacaoItem}>
                  <Ionicons
                    name={r.valido ? "checkmark-circle" : "close-circle"}
                    size={16}
                    color={r.valido ? "#21C25E" : "#E53935"}
                  />
                  <Text
                    style={[
                      styles.validacaoTexto,
                      r.valido
                        ? styles.validacaoTextoOk
                        : styles.validacaoTextoErro,
                    ]}
                  >
                    {r.msg}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputComIcone]}
              value={criar.confirmarSenha}
              onChangeText={criar.setConfirmarSenha}
              secureTextEntry={!showConfirmarSenha}
              placeholder=""
              editable={!criar.loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmarSenha((s) => !s)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirmarSenha ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {senhaTocada &&
            criar.confirmarSenha.length > 0 &&
            !senhasConferem && (
              <View style={styles.validacaoItem}>
                <Ionicons name="close-circle" size={16} color="#E53935" />
                <Text style={styles.validacaoTextoErro}>
                  As senhas não coincidem.
                </Text>
              </View>
            )}

          <View style={styles.termosContainer}>
            <Switch
              value={criar.aceiteTermos}
              onValueChange={criar.setAceiteTermos}
              trackColor={{ false: "#D3D3D3", true: "#2D85F8" }}
              thumbColor={criar.aceiteTermos ? COLORS.white : "#f4f3f4"}
            />
            <Text style={styles.termosTexto}>
              Li e aceito os{" "}
              <Text style={styles.termosLink}>termos de serviço</Text> e a{" "}
              <Text style={styles.termosLink}>política de privacidade</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onCadastrar}
            disabled={criar.loading}
          >
            <Text style={styles.saveButtonText}>
              {criar.loading ? "Cadastrando..." : "Cadastrar-se"}
            </Text>
          </TouchableOpacity>

          {criar.error ? (
            <Text style={styles.mensagemErro}>{criar.error}</Text>
          ) : null}
        </View>

        <View style={styles.areaGoogle}>
          <Text style={styles.ouConecte}>Ou conecte-se com</Text>
          <TouchableOpacity style={styles.botaoGoogle} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={24} color="#333" />
            <Text style={styles.botaoGoogleText}>Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.linkLogin}>
          Já possui conta?{" "}
          <Text
            style={styles.linkLoginDestaque}
            onPress={() => navigation.navigate("Login")}
          >
            Efetue seu login
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaCriarConta;
