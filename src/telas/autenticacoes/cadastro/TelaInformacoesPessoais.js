import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import TituloPagina from '../../../componentes/TituloPagina';
import { useInformacoesPessoais } from './hooks/useInformacoesPessoais';
import { styles } from './styles/TelaInformacoesPessoais.styles';

function TelaInformacoesPessoais({ navigation, route }) {
  const { token, user } = route.params || {};
  const userId = user && typeof user === 'object' && 'id' in user ? user.id : null;
  const info = useInformacoesPessoais(userId);

  const onContinuar = async () => {
    await info.handleContinuar(navigation, token, user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Adicione suas informações para começarmos
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={info.nome}
            onChangeText={info.setNome}
            placeholder=""
            editable={!info.loading}
          />

          <Text style={styles.label}>Sobrenome</Text>
          <TextInput
            style={styles.input}
            value={info.sobrenome}
            onChangeText={info.setSobrenome}
            placeholder=""
            editable={!info.loading}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={info.telefone}
            onChangeText={info.setTelefone}
            placeholder=""
            keyboardType="phone-pad"
            editable={!info.loading}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onContinuar}
            disabled={info.loading}
          >
            <Text style={styles.saveButtonText}>
              {info.loading ? 'Salvando...' : 'Continuar'}
            </Text>
          </TouchableOpacity>

          {info.error ? (
            <Text style={styles.mensagemErro}>{info.error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaInformacoesPessoais;
