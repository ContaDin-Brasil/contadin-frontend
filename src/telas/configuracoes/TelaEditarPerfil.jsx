import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { useEditarPerfil } from './hooks/useEditarPerfil';
import { styles } from './styles/TelaEditarPerfil.styles';

const EditProfileScreen = ({ navigation }) => {
  const perfil = useEditarPerfil();

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={() => navigation.goBack()}
      >
        Editar Perfil
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>

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
          value={perfil.nome}
          onChangeText={perfil.setNome}
          placeholder=""
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          value={perfil.sobrenome}
          onChangeText={perfil.setSobrenome}
          placeholder=""
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={perfil.tel}
          onChangeText={perfil.setTel}
          placeholder=""
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={perfil.email}
          onChangeText={perfil.setEmail}
          placeholder=""
          keyboardType="email-address"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Notificações Push</Text>
          <Switch
            value={perfil.pushNotifications}
            onValueChange={perfil.setPushNotifications}
            trackColor={{ false: '#D3D3D3', true: '#6BA7FF' }}
            thumbColor={perfil.pushNotifications ? '#FFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Tema Escuro</Text>
          <Switch
            value={perfil.darkTheme}
            onValueChange={perfil.setDarkTheme}
            trackColor={{ false: '#D3D3D3', true: '#6BA7FF' }}
            thumbColor={perfil.darkTheme ? '#FFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={perfil.handleSaveProfile}>
          <Ionicons name="save-outline" size={24} color="#000" />
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
