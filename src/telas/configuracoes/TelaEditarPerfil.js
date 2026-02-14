import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditProfileScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  const handleSaveProfile = () => {
    // Implementar lógica de salvar alterações
    console.log('Perfil atualizado');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <View style={styles.avatarIcon}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
        </View>
        <TouchableOpacity style={styles.changePhotoContainer}>
          <Text style={styles.changePhotoText}>Alterar Foto</Text>
          <Ionicons name="pencil" size={16} color="#333" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder=""
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          value={sobrenome}
          onChangeText={setSobrenome}
          placeholder=""
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder=""
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder=""
          keyboardType="email-address"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Notificações Push</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#D3D3D3', true: '#6BA7FF' }}
            thumbColor={pushNotifications ? '#FFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Tema Escuro</Text>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{ false: '#D3D3D3', true: '#6BA7FF' }}
            thumbColor={darkTheme ? '#FFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
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
  changePhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editIcon: {
    marginTop: 2,
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
