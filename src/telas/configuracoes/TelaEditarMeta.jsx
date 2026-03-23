import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import TituloPagina from '../../componentes/TituloPagina';
import { styles } from './styles/TelaMetaForm.styles';

const META_MOCK = {
  id: 'meta-01',
  titulo: 'Reduzir delivery no mes',
  tipo: 'reduzir',
  categoria: 'Alimentacao',
  alvo: 450,
  atual: 320,
  prazo: '30 dias',
  observacoes: 'Evitar pedidos em dias de semana.',
  lembretes: true,
};

const formatarMoeda = (valor) => {
  if (Number.isNaN(valor)) {
    return 'R$ 0,00';
  }
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
};

const TelaEditarMeta = ({ navigation, route }) => {
  const metaInicial = route.params?.meta || META_MOCK;
  const [tipo, setTipo] = useState(metaInicial.tipo);
  const [titulo, setTitulo] = useState(metaInicial.titulo);
  const [categoria, setCategoria] = useState(metaInicial.categoria);
  const [valorAlvo, setValorAlvo] = useState(String(metaInicial.alvo));
  const [valorAtual, setValorAtual] = useState(String(metaInicial.atual));
  const [prazoDias, setPrazoDias] = useState(metaInicial.prazo.replace(' dias', ''));
  const [observacoes, setObservacoes] = useState(metaInicial.observacoes || '');
  const [lembretesAtivos, setLembretesAtivos] = useState(Boolean(metaInicial.lembretes));

  const progresso = useMemo(() => {
    const alvo = parseFloat(valorAlvo.replace(',', '.')) || 0;
    const atual = parseFloat(valorAtual.replace(',', '.')) || 0;
    if (alvo === 0) {
      return 0;
    }
    return Math.min(atual / alvo, 1);
  }, [valorAlvo, valorAtual]);

  const handleSalvar = () => {
    Alert.alert('Meta atualizada', 'As alteracoes foram salvas.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleExcluir = () => {
    Alert.alert('Excluir meta', 'Tem certeza que deseja excluir esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={() => navigation.goBack()}>
        Editar meta
      </TituloPagina>

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, styles.contentWithFooter]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Progresso atual</Text>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>{metaInicial.prazo}</Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressValue}>{formatarMoeda(parseFloat(valorAtual) || 0)}</Text>
                <Text style={styles.progressValue}>{Math.round(progresso * 100)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.round(progresso * 100)}%` }]} />
              </View>
            </View>
          </View>

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
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Valor atual</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>R$</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0,00"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={valorAtual}
                    onChangeText={setValorAtual}
                  />
                </View>
              </View>
              <View style={styles.rowItem}>
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
              </View>
            </View>
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
            <Text style={styles.primaryButtonText}>Salvar alteracoes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton} onPress={handleExcluir}>
            <Text style={styles.dangerButtonText}>Excluir meta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TelaEditarMeta;
