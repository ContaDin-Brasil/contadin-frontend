import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import CustomModal from '../../componentes/modais/ModalBase';
import { useAuth } from '../../contexts/AuthContext';
import { useGerenciarConta } from './hooks/useGerenciarConta';
import { styles } from './styles/TelaConfiguracoes.styles';

const SettingsScreen = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { logout } = useAuth();
  const conta = useGerenciarConta();

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
  };

  const SettingItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemContent}>
        <View style={styles.settingIconContainer}>
          {icon}
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#B0B0B0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina>Configurações</TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Seção: Perfil e Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil e Conta</Text>
          <View style={styles.sectionContent}>
            <SettingItem 
              icon={<Ionicons name="person-outline" size={24} color="#5BA3FF" />}
              title="Editar Perfil" 
              subtitle="Atualize suas informações pessoais"
              onPress={() => navigation.navigate('EditarPerfil')}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={<Ionicons name="key-outline" size={24} color="#5BA3FF" />}
              title="Alterar Senha" 
              subtitle="Atualize sua senha de segurança"
              onPress={() => navigation.navigate('AlterarSenha')}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={<Ionicons name="person-remove-outline" size={24} color="#E31C23" />}
              title="Excluir Conta" 
              subtitle="Remova sua conta permanentemente"
              onPress={() => conta.setDeleteModalVisible(true)}
            />
          </View>
        </View>

        {/* Seção: Financeiro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financeiro</Text>
          <View style={styles.sectionContent}>
            <SettingItem 
              icon={<Ionicons name="flag-outline" size={24} color="#5BA3FF" />}
              title="Objetivos" 
              subtitle="Planeje limites e aumento de receita"
              onPress={() => navigation.navigate('Objetivos')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={<Ionicons name="document-text-outline" size={24} color="#5BA3FF" />}
              title="Importar Planilha"
              subtitle="Importe transacoes de Excel e revise antes de salvar"
              onPress={() => navigation.navigate('ImportarPlanilha')}
            />
          </View>
        </View>

        {/* Seção: Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <View style={styles.sectionContent}>
            <SettingItem 
              icon={<Ionicons name="help-circle-outline" size={24} color="#5BA3FF" />}
              title="Ajuda e Suporte" 
              subtitle="Dúvidas e informações úteis"
              onPress={() => navigation.navigate('Ajuda')}
            />
          </View>
        </View>

        {/* Seção: Segurança */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Ionicons name="log-out-outline" size={24} color="#E31C23" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

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

      <CustomModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Sair da conta"
        onConfirm={handleLogout}
        confirmText="Sair da conta"
        cancelText="Cancelar"
      >
        <Text style={styles.modalText}>Realmente deseja sair?</Text>
      </CustomModal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
