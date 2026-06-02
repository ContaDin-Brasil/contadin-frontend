import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, SafeAreaView, ActivityIndicator } from 'react-native';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { useEditarPerfil } from './hooks/useEditarPerfil';
import { confirmarAcao } from '../../utils/confirmarAcao';
import { getColorsByTheme } from '../../styles/colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getStyles } from './styles/TelaEditarPerfil.styles';

const EditProfileScreen = ({ navigation }) => {
  const perfil = useEditarPerfil();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const permitirSaidaRef = useRef(false);

  const confirmarSaidaSemSalvar = useCallback(
    (onConfirmarSaida) => {
      if (!perfil.isDirty) {
        onConfirmarSaida();
        return;
      }

      const mensagem = 'Você tem mudanças não salvas no perfil. Se sair agora, elas serão perdidas.';

      confirmarAcao({
        titulo: 'Descartar alterações?',
        mensagem,
        textoConfirmar: 'Sair sem salvar',
        onConfirmar: onConfirmarSaida,
      });
    },
    [perfil.isDirty],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (permitirSaidaRef.current || !perfil.isDirty) {
        return;
      }

      event.preventDefault();
      confirmarSaidaSemSalvar(() => {
        permitirSaidaRef.current = true;
        navigation.dispatch(event.data.action);
      });
    });

    return unsubscribe;
  }, [confirmarSaidaSemSalvar, navigation, perfil.isDirty]);

  const handleVoltar = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={handleVoltar}
      >
        Editar Perfil
      </TituloPagina>

      {perfil.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      ) : (
        <View style={styles.screen}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Dados pessoais</Text>

              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={perfil.nome}
                onChangeText={perfil.setNome}
                placeholder=""
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.label}>Sobrenome</Text>
              <TextInput
                style={styles.input}
                value={perfil.sobrenome}
                onChangeText={perfil.setSobrenome}
                placeholder=""
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={perfil.telefone}
                onChangeText={perfil.setTelefone}
                placeholder=""
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={perfil.email}
                onChangeText={perfil.setEmail}
                placeholder=""
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLORS.textSecondary}
              />

              {perfil.emailFoiAlterado ? (
                <Text style={styles.impactText}>
                  Este email sera usado para login e recuperacao.
                </Text>
              ) : null}

              <View style={styles.sectionDivider} />

              <Text style={styles.sectionTitle}>Preferencias do app</Text>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Tema Escuro</Text>
                <Switch
                  value={perfil.darkTheme}
                  onValueChange={perfil.setDarkTheme}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                  thumbColor={perfil.darkTheme ? COLORS.primary : COLORS.backgroundLight}
                />
              </View>
            </View>
          </ScrollView>

          <BotoesAcaoFixo
            primaryLabel="Salvar Alterações"
            primaryLoadingLabel="Salvando..."
            onPrimaryPress={perfil.handleSaveProfile}
            primaryDisabled={perfil.isSaving || !perfil.isDirty}
            primaryLoading={perfil.isSaving}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditProfileScreen;
