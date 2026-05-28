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
import ModalBase from "../../../componentes/modais/ModalBase";
import { useCriarConta } from "./hooks/useCriarConta";
import { REQUISITOS_SENHA } from "../../configuracoes/constants/constantesConfiguracao";
import {
  obterResultadosValidacaoSenha,
  verificarSenhasConferem,
} from "../../../utils/senhaUtils";
import COLORS from "../../../styles/colors";
import { styles } from "./styles/TelaCriarConta.styles";

const TERMOS_DE_USO = `1. Aceitação dos termos\nAo criar uma conta no Contadin, você concorda com estes Termos de Uso. Se não concordar, não utilize o aplicativo.\n\n2. Descrição do serviço\nO Contadin oferece ferramentas de gestão financeira pessoal, como organização de transações, categorias, metas e relatórios. O serviço não fornece consultoria financeira, contabilidade, crédito ou investimentos.\n\n3. Cadastro e segurança\nVocê é responsável por manter a confidencialidade da sua conta, senha e dispositivos. Qualquer uso indevido deve ser comunicado imediatamente.\n\n4. Uso permitido e proibições\nÉ proibido: (a) praticar fraude, falsificação ou manipulação de dados; (b) acessar sistemas de forma não autorizada; (c) utilizar o app para atividades ilegais; (d) tentar burlar mecanismos de segurança.\n\n5. Propriedade intelectual\nO Contadin, suas marcas, layout, código, logotipos e conteúdos são protegidos por direitos autorais e outras leis de propriedade intelectual. Você não pode copiar, modificar, distribuir ou explorar comercialmente sem autorização.\n\n6. Cancelamento e reembolso\nSe houver planos pagos, o cancelamento pode ser solicitado a qualquer momento. Reembolsos seguem a legislação aplicável e as regras do provedor de pagamento. Em compras digitais, pode existir prazo legal para arrependimento.\n\n7. Limitação de responsabilidade\nO Contadin é fornecido "como está". Não garantimos disponibilidade ininterrupta, ausência de falhas ou resultados financeiros. Em nenhuma hipótese seremos responsáveis por perdas indiretas, lucros cessantes ou danos consequenciais.\n\n8. Privacidade e dados\nO tratamento de dados pessoais segue a Política de Privacidade. Ao usar o app, você concorda com a coleta e o uso de dados conforme descrito nela.\n\n9. Alterações dos termos\nPodemos atualizar estes Termos de Uso. A versão vigente será disponibilizada no app. O uso continuado após atualizações implica aceite.\n\n10. Contato\nDúvidas? Fale com a equipe pelo email: contadinbrasil01@gmail.com\n\nVigência: 28/05/2026`;

function TelaCriarConta({ navigation }) {
  const criar = useCriarConta();
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [tooltipVisivel, setTooltipVisivel] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);
  const [termosVisivel, setTermosVisivel] = useState(false);

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

  const abrirTermos = () => setTermosVisivel(true);
  const fecharTermos = () => setTermosVisivel(false);
  const aceitarTermos = () => {
    criar.setAceiteTermos(true);
    setTermosVisivel(false);
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
              <Text style={styles.termosLink} onPress={abrirTermos}>
                Termos de Uso
              </Text>{" "}
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
      <ModalBase
        visible={termosVisivel}
        onClose={fecharTermos}
        title="Termos de uso"
        onConfirm={aceitarTermos}
        confirmText="Aceitar"
        cancelText="Fechar"
        confirmVariant="success"
      >
        <ScrollView
          style={styles.termosModalScroll}
          contentContainerStyle={styles.termosModalContent}
        >
          <Text style={styles.termosModalTexto}>{TERMOS_DE_USO}</Text>
        </ScrollView>
      </ModalBase>
    </SafeAreaView>
  );
}

export default TelaCriarConta;
