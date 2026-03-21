import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { useAlterarSenha } from './hooks/useAlterarSenha';
import { REQUISITOS_SENHA } from './constants/constantesConfiguracao';
import { styles } from './styles/TelaAlterarSenha.styles';

const ChangePasswordScreen = ({ navigation }) => {
  const senha = useAlterarSenha();

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={() => navigation.goBack()}
      >
        Alterar Senha
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Adicione a sua senha atual</Text>
        <TextInput
          style={styles.input}
          value={senha.senhaAtual}
          onChangeText={senha.setSenhaAtual}
          secureTextEntry
          placeholder=""
        />

        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={styles.input}
          value={senha.novaSenha}
          onChangeText={senha.setNovaSenha}
          secureTextEntry
          placeholder=""
        />

        <Text style={styles.label}>Confirme a Nova Senha</Text>
        <TextInput
          style={styles.input}
          value={senha.confirmarSenha}
          onChangeText={senha.setConfirmarSenha}
          secureTextEntry
          placeholder=""
        />

        <View style={styles.requirementsContainer}>
          {REQUISITOS_SENHA.map((requisito, index) => (
            <Text key={index} style={styles.requirementText}>• {requisito}</Text>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={senha.handleSavePassword}>
          <Ionicons name="save-outline" size={24} color="#000" />
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
