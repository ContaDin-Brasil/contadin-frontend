import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from './styles/TelaBemVindo.styles';

function TelaBemVindo({ navigation, route }) {
  const { token, user } = route.params || {};
  const onAdicionarInformacoes = () => {
    navigation.navigate('InformacoesPessoais', { token, user });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Seja bem vindo!</Text>
      <Text style={styles.subtitulo}>Ao futuro da Organização Financeira!</Text>
      <Text style={styles.pergunta}>Vamos nos conhecer?</Text>
      <TouchableOpacity
        style={styles.botao}
        onPress={onAdicionarInformacoes}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoText}>Adicionar Informações</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default TelaBemVindo;
