import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../componentes/BotaoCustomizado';
import CustomModal from '../../componentes/modais/ModalBase';

const AccountScreen = ({ navigation }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [deactivatedModalVisible, setDeactivatedModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.toLowerCase() === 'excluir') {
      setConfirmDeleteModalVisible(false);
      setDeactivatedModalVisible(true);
    }
  };

  const handleFinalConfirm = () => {
    setDeactivatedModalVisible(false);
    // Implementar lógica de exclusão/desativação aqui
    console.log('Conta desativada');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Conta</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <CustomButton 
          title="Alterar Senha" 
          onPress={() => navigation.navigate('ChangePassword')}
          icon={<Ionicons name="key-outline" size={24} color="#000" />}
        />
        
        <CustomButton 
          title="Excluir Conta" 
          variant="danger"
          onPress={() => setDeleteModalVisible(true)}
          icon={<Ionicons name="person-remove-outline" size={24} color="#000" />}
        />
      </View>

      {/* Modal: Excluir conta */}
      <CustomModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Excluir conta"
        onConfirm={handleDeleteAccount}
        confirmText="Apagar conta"
        cancelText="Cancelar"
      >
        <View style={styles.modalContent}>
          <Text style={styles.bulletPoint}>• Sua conta será desativada por 90 dias, e poderá ser recuperada neste período.</Text>
          <Text style={styles.bulletPoint}>• Após os 90 dias, não será recuperável.</Text>
          <Text style={styles.bulletPoint}>• Esta ação irá deletar todas as suas informações adicionadas no ContaDin.</Text>
          <Text style={styles.modalQuestion}>Realmente deseja apagar a sua conta?</Text>
        </View>
      </CustomModal>

      {/* Modal: Para Excluir (com input) */}
      <CustomModal
        visible={confirmDeleteModalVisible}
        onClose={() => {
          setConfirmDeleteModalVisible(false);
          setDeleteConfirmText('');
        }}
        title="Para Excluir:"
        onConfirm={handleConfirmDelete}
        confirmText="Continuar"
        cancelText="Cancelar"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Digite <Text style={styles.boldText}>excluir</Text> no campo abaixo</Text>
          <TextInput
            style={styles.input}
            value={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            placeholder=""
          />
        </View>
      </CustomModal>

      {/* Modal: Conta Desativada */}
      <CustomModal
        visible={deactivatedModalVisible}
        onClose={() => setDeactivatedModalVisible(false)}
        title="Conta Desativada"
        onConfirm={handleFinalConfirm}
        confirmText="Continuar"
        cancelText="Cancelar"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Sua conta está desativada.</Text>
          <Text style={styles.modalText}>90 dias a partir de hoje ela será excluída.</Text>
        </View>
      </CustomModal>
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
    marginBottom: 40,
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
  buttonsContainer: {
    marginTop: 20,
  },
  modalContent: {
    marginVertical: 10,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  modalQuestion: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    fontWeight: '500',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 8,
  },
});

export default AccountScreen;
