import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { confirmarAcao } from '../../utils/confirmarAcao';
import { styles } from './styles/TelaMetaForm.styles';

const META_MOCK = {
  id: 'meta-01',
  nome: 'Reduzir delivery no mes',
  categoria: 'Alimentacao',
  valor: 450,
  dataFimMeta: '25/04/2026',
};

const TelaEditarMeta = ({ navigation, route }) => {
  const metaInicial = route.params?.meta || META_MOCK;
  const [nome, setNome] = useState(metaInicial.nome);
  const [categoria, setCategoria] = useState(metaInicial.categoria);
  const [valor, setValor] = useState(String(metaInicial.valor));
  const [dataFimMeta, setDataFimMeta] = useState(metaInicial.dataFimMeta);

  const handleSalvar = () => {
    Alert.alert('Meta atualizada', 'As alteracoes foram salvas.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleExcluir = () => {
    const mensagem = 'Tem certeza que deseja excluir esta meta?';

    confirmarAcao({
      titulo: 'Excluir meta',
      mensagem,
      textoConfirmar: 'Excluir',
      onConfirmar: () => navigation.goBack(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={() => navigation.goBack()}>
        Editar meta
      </TituloPagina>

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Nome da meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Reduzir gastos com delivery"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Alimentacao"
              placeholderTextColor="#999"
              value={categoria}
              onChangeText={setCategoria}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Valor da meta</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0,00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Data fim da meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30/04/2026"
              placeholderTextColor="#999"
              value={dataFimMeta}
              onChangeText={setDataFimMeta}
            />
          </View>
        </ScrollView>

        <BotoesAcaoFixo
          primaryLabel="Salvar alteracoes"
          onPrimaryPress={handleSalvar}
          secondaryLabel="Excluir meta"
          secondaryVariant="danger"
          onSecondaryPress={handleExcluir}
        />
      </View>
    </SafeAreaView>
  );
};

export default TelaEditarMeta;
