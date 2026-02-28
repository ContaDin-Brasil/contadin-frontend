import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { styles } from './styles/TelaCadastroSucesso.styles';

function TelaCadastroSucesso({ route }) {
  const { loginWithToken } = useAuth();
  const token = route.params?.token;
  const user = route.params?.user;

  const onComecarAContar = async () => {
    if (token) {
      await loginWithToken(token, user ?? undefined);
    }
    // App re-renderiza e exibe NavegadorPrincipal.
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconeSucesso}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>
      <Text style={styles.textoSucesso}>Informações cadastradas com sucesso!</Text>
      <TouchableOpacity
        style={styles.botaoContinuar}
        onPress={onComecarAContar}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoContinuarText}>Começar a contar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default TelaCadastroSucesso;
