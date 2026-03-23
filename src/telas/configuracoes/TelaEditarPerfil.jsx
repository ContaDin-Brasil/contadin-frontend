import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { useEditarPerfil } from './hooks/useEditarPerfil';
import { styles } from './styles/TelaEditarPerfil.styles';

const EditProfileScreen = ({ navigation }) => {
  const perfil = useEditarPerfil();
  const permitirSaidaRef = useRef(false);

  const confirmarSaidaSemSalvar = useCallback(
    (onConfirmarSaida) => {
      if (!perfil.isDirty) {
        onConfirmarSaida();
        return;
      }

      Alert.alert(
        'Descartar alterações?',
        'Você tem mudanças não salvas no perfil. Se sair agora, elas serão perdidas.',
        [
          {
            text: 'Continuar editando',
            style: 'cancel',
          },
          {
            text: 'Sair sem salvar',
            style: 'destructive',
            onPress: onConfirmarSaida,
          },
        ],
      );
    },
    [perfil.isDirty],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (permitirSaidaRef.current || !perfil.isDirty) {
        return;
      }

      event.preventDefault();
      confirmarSaidaSemSalvar(() => {
        permitirSaidaRef.current = true;
        navigation.dispatch(event.data.action);
      });
    });

    return unsubscribe;
  }, [confirmarSaidaSemSalvar, navigation, perfil.isDirty]);

  const handleVoltar = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={handleVoltar}
      >
        Editar Perfil
      </TituloPagina>

      {perfil.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A9EFF" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>

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
          autoCapitalize="none"
        />

        {perfil.emailFoiAlterado ? (
          <Text style={styles.impactText}>
            Este email sera usado para login e recuperacao.
          </Text>
        ) : null}

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Preferencias do app</Text>

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

        <TouchableOpacity
          style={[
            styles.saveButton,
            (perfil.isSaving || !perfil.isDirty) && styles.saveButtonDisabled,
          ]}
          onPress={perfil.handleSaveProfile}
          disabled={perfil.isSaving || !perfil.isDirty}
        >
          {perfil.isSaving ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons name="save-outline" size={24} color="#000" />
          )}
          <Text style={styles.saveButtonText}>
            {perfil.isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditProfileScreen;
