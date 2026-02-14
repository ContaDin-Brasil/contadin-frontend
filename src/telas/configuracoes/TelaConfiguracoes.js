import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import CustomButton from '../../componentes/BotaoCustomizado';
import CustomModal from '../../componentes/modais/ModalBase';

const SettingsScreen = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    // Implementar lógica de logout aqui
    console.log('Usuário deslogado');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Configurações</Text>
      
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B8DBFF',
    borderWidth: 4,
    borderColor: '#4A9EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    alignItems: 'center',
  },
  avatarHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 5,
  },
  avatarBody: {
    width: 45,
    height: 35,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 2,
    borderColor: '#333',
    borderBottomWidth: 0,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  logoutContainer: {
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsScreen;
