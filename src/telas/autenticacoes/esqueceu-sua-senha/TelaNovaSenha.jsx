import React, { useState, useMemo } from "react";
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
import { useNovaSenha } from "./hooks/useNovaSenha";
import { REQUISITOS_SENHA } from "../../configuracoes/constants/constantesConfiguracao";
import { styles } from "./styles/TelaNovaSenha.styles";

const VALIDACOES_SENHA = [
  { msg: REQUISITOS_SENHA[0], testar: (s) => s.length >= 8 },
  { msg: REQUISITOS_SENHA[1], testar: (s) => /\d/.test(s) },
  { msg: REQUISITOS_SENHA[2], testar: (s) => /[!@$%&_]/.test(s) },
  {
    msg: REQUISITOS_SENHA[3],
    testar: (s) =>
      !/(123|234|345|456|567|678|789|321|432|543|654|765|876|987)/.test(s),
  },
  { msg: REQUISITOS_SENHA[4], testar: (s) => !/(\d)\1{2}/.test(s) },
];

function TelaNovaSenha({ navigation, route }) {
  const token = route.params?.token ?? "";
  const novaSenha = useNovaSenha(token);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [tooltipVisivel, setTooltipVisivel] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);

  const resultadosValidacao = useMemo(
    () =>
      VALIDACOES_SENHA.map((v) => ({
        msg: v.msg,
        valido: v.testar(novaSenha.senha),
      })),
    [novaSenha.senha],
  );

  const todasValidas = resultadosValidacao.every((r) => r.valido);
  const senhasConferem =
    novaSenha.senha.length > 0 &&
    novaSenha.senha === novaSenha.confirmarSenha;

  const onAtualizar = async () => {
    await novaSenha.handleAtualizar(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Atualize a sua senha!
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.instrucao}>
            Insira abaixo, a senha que deseja utilizar.
          </Text>

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
              value={novaSenha.senha}
              onChangeText={novaSenha.setSenha}
              secureTextEntry={!showSenha}
              placeholder=""
              editable={!novaSenha.loading}
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

          {senhaTocada && novaSenha.senha.length > 0 && !todasValidas && (
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
              value={novaSenha.confirmarSenha}
              onChangeText={novaSenha.setConfirmarSenha}
              secureTextEntry={!showConfirmar}
              placeholder=""
              editable={!novaSenha.loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmar((s) => !s)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirmar ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {senhaTocada &&
            novaSenha.confirmarSenha.length > 0 &&
            !senhasConferem && (
              <View style={styles.validacaoItem}>
                <Ionicons name="close-circle" size={16} color="#E53935" />
                <Text style={styles.validacaoTextoErro}>
                  As senhas não coincidem.
                </Text>
              </View>
            )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onAtualizar}
            disabled={novaSenha.loading}
          >
            <Ionicons name="key-outline" size={24} color="#FFF" />
            <Text style={styles.saveButtonText}>
              {novaSenha.loading ? "Atualizando..." : "Atualizar Senha"}
            </Text>
          </TouchableOpacity>
          {novaSenha.error ? (
            <Text style={styles.mensagemErro}>{novaSenha.error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaNovaSenha;
