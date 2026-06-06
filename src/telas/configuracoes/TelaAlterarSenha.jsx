import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import ModalAviso from '../../componentes/modais/ModalAviso';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { useTheme } from '../../contexts/ThemeContext';
import { getColorsByTheme } from '../../styles/colors';
import { useAlterarSenha } from './hooks/useAlterarSenha';
import { REQUISITOS_SENHA } from './constants/constantesConfiguracao';
import {
  obterResultadosValidacaoSenha,
  verificarSenhasConferem,
} from '../../utils/senhaUtils';
import { getStyles } from './styles/TelaAlterarSenha.styles';

const ChangePasswordScreen = ({ navigation }) => {
  const senha = useAlterarSenha();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [tooltipVisivel, setTooltipVisivel] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);

  const resultadosValidacao = useMemo(
    () => obterResultadosValidacaoSenha(senha.novaSenha),
    [senha.novaSenha],
  );

  const todasValidas = resultadosValidacao.every((resultado) => resultado.valido);
  const senhasConferem = verificarSenhasConferem(
    senha.novaSenha,
    senha.confirmarSenha,
  );

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={() => navigation.goBack()}
      >
        Alterar Senha
      </TituloPagina>
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.label}>Adicione a sua senha atual</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputComIcone]}
                value={senha.senhaAtual}
                onChangeText={senha.setSenhaAtual}
                secureTextEntry={!showSenhaAtual}
                placeholder=""
                editable={!senha.loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowSenhaAtual((valorAtual) => !valorAtual)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showSenhaAtual ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.textTertiary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.labelRow}>
              <Text style={styles.labelInline}>Nova Senha</Text>
              <TouchableOpacity
                onPress={() => setTooltipVisivel((visivel) => !visivel)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={tooltipVisivel ? COLORS.primary : COLORS.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {tooltipVisivel && (
              <View style={styles.tooltip}>
                <View style={styles.tooltipSeta} />
                <Text style={styles.tooltipTitulo}>Requisitos da senha:</Text>
                {REQUISITOS_SENHA.map((requisito, index) => (
                  <Text key={index} style={styles.tooltipTexto}>
                    • {requisito}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputComIcone]}
                value={senha.novaSenha}
                onChangeText={senha.setNovaSenha}
                secureTextEntry={!showNovaSenha}
                placeholder=""
                editable={!senha.loading}
                onBlur={() => setSenhaTocada(true)}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNovaSenha((valorAtual) => !valorAtual)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showNovaSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {senhaTocada && senha.novaSenha.length > 0 && !todasValidas && (
              <View style={styles.validacaoContainer}>
                {resultadosValidacao.map((resultado, index) => (
                  <View key={index} style={styles.validacaoItem}>
                    <Ionicons
                      name={resultado.valido ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={resultado.valido ? COLORS.success : COLORS.error}
                    />
                    <Text
                      style={[
                        styles.validacaoTexto,
                        resultado.valido
                          ? styles.validacaoTextoOk
                          : styles.validacaoTextoErro,
                      ]}
                    >
                      {resultado.msg}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.label}>Confirme a Nova Senha</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputComIcone]}
                value={senha.confirmarSenha}
                onChangeText={senha.setConfirmarSenha}
                secureTextEntry={!showConfirmarSenha}
                placeholder=""
                editable={!senha.loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmarSenha((valorAtual) => !valorAtual)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {senhaTocada && senha.confirmarSenha.length > 0 && !senhasConferem && (
              <View style={styles.validacaoItem}>
                <Ionicons name="close-circle" size={16} color={COLORS.error} />
                <Text style={styles.validacaoTextoErro}>As senhas não coincidem.</Text>
              </View>
            )}

            {senha.error ? <Text style={styles.mensagemErro}>{senha.error}</Text> : null}
          </View>
        </ScrollView>

        <BotoesAcaoFixo
          primaryLabel="Salvar Alterações"
          primaryLoadingLabel="Salvando..."
          onPrimaryPress={senha.handleSavePassword}
          primaryDisabled={senha.loading}
          primaryLoading={senha.loading}
        />
      </View>
      <ModalAviso
        visible={senha.avisoModal.visible}
        titulo={senha.avisoModal.titulo}
        mensagem={senha.avisoModal.mensagem}
        onClose={senha.fecharAviso}
      />
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
