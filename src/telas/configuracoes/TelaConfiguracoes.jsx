import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import CustomButton from '../../componentes/BotaoCustomizado';
import CustomModal from '../../componentes/modais/ModalBase';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles/TelaConfiguracoes.styles';

const SettingsScreen = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina>Configurações</TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <View style={styles.avatarIcon}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
        </View>
        <Text style={styles.greeting}>Olá, Usuário</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <CustomButton 
          title="Editar Perfil" 
          onPress={() => navigation.navigate('EditProfile')}
          icon={<Ionicons name="person-outline" size={24} color="#000" />}
        />
        
        <CustomButton 
          title="Conta" 
          onPress={() => navigation.navigate('Account')}
          icon={<Ionicons name="settings-outline" size={24} color="#000" />}
        />
        
        <CustomButton 
          title="Ajuda" 
          onPress={() => navigation.navigate('Help')}
          icon={<Ionicons name="help-circle-outline" size={24} color="#000" />}
        />
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton 
          title="Sair" 
          variant="danger"
          onPress={() => setLogoutModalVisible(true)}
          icon={<Ionicons name="log-out-outline" size={24} color="#000" />}
        />
      </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
