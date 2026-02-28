import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../../componentes/TituloPagina';
import { useSelecaoBancos } from './hooks/useSelecaoBancos';
import { getLogoByName } from '../../../componentes/modais/logosInstituicoes';
import { styles } from './styles/TelaSelecaoBancos.styles';

function TelaSelecaoBancos({ navigation, route }) {
  const { token, user } = route.params || {};
  const userId = user && typeof user === 'object' && 'id' in user ? user.id : null;
  const sel = useSelecaoBancos(userId);

  const onContinuar = async () => {
    await sel.handleContinuar(navigation, token, user);
  };

  const renderBanco = (banco) => {
    const logo = getLogoByName(banco.nome);
    const selected = sel.selecionados.has(banco.id);
    return (
      <TouchableOpacity
        key={banco.id}
        style={styles.bankItem}
        onPress={() => sel.toggleSelecao(banco.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.bankIconWrapper,
            { backgroundColor: logo ? '#FFF' : banco.cor },
            selected && styles.bankIconWrapperSelected,
          ]}
        >
          {logo ? (
            <Image
              source={logo}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.bankIconText}>{banco.icone}</Text>
          )}
        </View>
        <Text style={styles.bankName} numberOfLines={2}>
          {banco.nome}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Quais Bancos você utiliza no seu dia a dia?
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.instrucao}>Selecione uma instituição</Text>
        <View style={styles.grid}>
          {sel.bancos.map(renderBanco)}
        </View>

        <TouchableOpacity
          style={styles.linkAdicionar}
          onPress={() => navigation.navigate('CadastroInstituicao', { token: route.params?.token, user: route.params?.user })}
          activeOpacity={0.8}
        >
          <Text style={styles.linkAdicionarText}>
            Seu banco não está na lista? Adicionar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={onContinuar}
          disabled={sel.loading}
        >
          <Text style={styles.saveButtonText}>
            {sel.loading ? 'Salvando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>

        {sel.error ? (
          <Text style={styles.mensagemErro}>{sel.error}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaSelecaoBancos;
