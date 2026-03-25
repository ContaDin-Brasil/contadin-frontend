import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { styles } from './styles/TelaMetaForm.styles';

const TelaAdicionarMeta = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [dataFimMeta, setDataFimMeta] = useState('');

  const handleSalvar = () => {
    Alert.alert('Meta criada', 'Sua meta foi adicionada com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={() => navigation.goBack()}>
        Adicionar meta
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
            <Text style={styles.helperText}>Valor total da meta cadastrada.</Text>
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
          primaryLabel="Salvar meta"
          onPrimaryPress={handleSalvar}
        />
      </View>
    </SafeAreaView>
  );
};

export default TelaAdicionarMeta;
