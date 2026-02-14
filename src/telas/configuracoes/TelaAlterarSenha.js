import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSavePassword = () => {
    // Implementar lógica de alteração de senha
    console.log('Senha alterada');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Alterar Senha</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Adicione a sua senha atual</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder=""
        />

        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder=""
        />

        <Text style={styles.label}>Confirme a Nova Senha</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder=""
        />

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementText}>• Deve conter ao menos 8 caracteres.</Text>
          <Text style={styles.requirementText}>• Deve conter ao menos 1 número.</Text>
          <Text style={styles.requirementText}>• Deve conter ao menos 1 caractere especial (!, @, $, % ou &).</Text>
          <Text style={styles.requirementText}>• Não deve conter sequência numérica ex.(123, 321 ou 456).</Text>
          <Text style={styles.requirementText}>• Não deve conter 3 números repetidos ex.(111, 222 ou 777).</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
          <Ionicons name="save-outline" size={24} color="#000" />
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  requirementsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
