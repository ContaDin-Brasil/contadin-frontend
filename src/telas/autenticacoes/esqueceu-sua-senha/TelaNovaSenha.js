import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { useNovaSenha } from './hooks/useNovaSenha';
import { REQUISITOS_SENHA } from '../../configuracoes/constants/constantesConfiguracao';
import { styles } from './styles/TelaNovaSenha.styles';

function TelaNovaSenha({ navigation, route }) {
  const token = route.params?.token ?? '';
  const novaSenha = useNovaSenha(token);

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
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={novaSenha.senha}
            onChangeText={novaSenha.setSenha}
            secureTextEntry
            placeholder=""
            editable={!novaSenha.loading}
          />
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            value={novaSenha.confirmarSenha}
            onChangeText={novaSenha.setConfirmarSenha}
            secureTextEntry
            placeholder=""
            editable={!novaSenha.loading}
          />
          <View style={styles.requirementsContainer}>
            {REQUISITOS_SENHA.map((requisito, index) => (
              <Text key={index} style={styles.requirementText}>
                • {requisito}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onAtualizar}
            disabled={novaSenha.loading}
          >
            <Ionicons name="key-outline" size={24} color="#000" />
            <Text style={styles.saveButtonText}>
              {novaSenha.loading ? 'Atualizando...' : 'Atualizar Senha'}
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
