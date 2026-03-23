import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import TituloPagina from '../../componentes/TituloPagina';
import { styles } from './styles/TelaMetaForm.styles';

const TelaAdicionarMeta = ({ navigation }) => {
  const [tipo, setTipo] = useState('reduzir');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [prazoDias, setPrazoDias] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [lembretesAtivos, setLembretesAtivos] = useState(true);

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
          contentContainerStyle={[styles.content, styles.contentWithFooter]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Tipo de meta</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[styles.typeButton, tipo === 'reduzir' && styles.typeButtonActive]}
                onPress={() => setTipo('reduzir')}
              >
                <Text style={[styles.typeButtonText, tipo === 'reduzir' && styles.typeButtonTextActive]}>
                  Reduzir gastos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, tipo === 'aumentar' && styles.typeButtonActive]}
                onPress={() => setTipo('aumentar')}
              >
                <Text style={[styles.typeButtonText, tipo === 'aumentar' && styles.typeButtonTextActive]}>
                  Aumentar receita
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Titulo da meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Reduzir gastos com delivery"
              placeholderTextColor="#999"
              value={titulo}
              onChangeText={setTitulo}
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
            <Text style={styles.label}>Valor alvo</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0,00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={valorAlvo}
                onChangeText={setValorAlvo}
              />
            </View>
            <Text style={styles.helperText}>Defina quanto deseja economizar ou ganhar.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Prazo (dias)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={prazoDias}
              onChangeText={setPrazoDias}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Observacoes</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Descreva detalhes da meta"
              placeholderTextColor="#999"
              multiline={true}
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Receber lembretes semanais</Text>
            <Switch
              value={lembretesAtivos}
              onValueChange={setLembretesAtivos}
              trackColor={{ false: '#DDD', true: '#B8DBFF' }}
              thumbColor={lembretesAtivos ? '#0066FF' : '#FFF'}
            />
          </View>
        </ScrollView>

        <View style={styles.fixedActionArea}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSalvar}>
            <Text style={styles.primaryButtonText}>Salvar meta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TelaAdicionarMeta;
