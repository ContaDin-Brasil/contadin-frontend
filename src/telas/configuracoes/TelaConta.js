import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../componentes/BotaoCustomizado';
import CustomModal from '../../componentes/modais/ModalBase';
import { useGerenciarConta } from './hooks/useGerenciarConta';
import { styles } from './styles/TelaConta.styles';

const AccountScreen = ({ navigation }) => {
  const conta = useGerenciarConta();

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
          onPress={() => conta.setDeleteModalVisible(true)}
          icon={<Ionicons name="person-remove-outline" size={24} color="#000" />}
        />
      </View>

      {/* Modal: Excluir conta */}
      <CustomModal
        visible={conta.deleteModalVisible}
        onClose={() => conta.setDeleteModalVisible(false)}
        title="Excluir conta"
        onConfirm={conta.handleDeleteAccount}
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
        visible={conta.confirmDeleteModalVisible}
        onClose={conta.handleCloseConfirmModal}
        title="Para Excluir:"
        onConfirm={conta.handleConfirmDelete}
        confirmText="Continuar"
        cancelText="Cancelar"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Digite <Text style={styles.boldText}>excluir</Text> no campo abaixo</Text>
          <TextInput
            style={styles.input}
            value={conta.deleteConfirmText}
            onChangeText={conta.setDeleteConfirmText}
            placeholder=""
          />
        </View>
      </CustomModal>

      {/* Modal: Conta Desativada */}
      <CustomModal
        visible={conta.deactivatedModalVisible}
        onClose={() => conta.setDeactivatedModalVisible(false)}
        title="Conta Desativada"
        onConfirm={conta.handleFinalConfirm}
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

export default AccountScreen;
