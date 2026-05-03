import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { DatePickerInput } from '../../componentes/DatePickerInput';
import ModalAviso from '../../componentes/modais/ModalAviso';
import { COLORS } from '../../styles/colors';
import { styles } from './styles/TelaObjetivoForm.styles';

const TIPOS_OBJETIVO = [
  { id: 'LIMITE_GASTO', label: 'Diminuir gasto' },
  { id: 'AUMENTO_RECEITA', label: 'Aumentar receita' },
];

const PRIORIDADES = [
  { id: 'ALTA', label: 'Alta' },
  { id: 'MEDIA', label: 'Média' },
  { id: 'BAIXA', label: 'Baixa' },
];

const PRIORIDADE_VISUAL = {
  ALTA: { label: 'Alta', color: COLORS.error, background: '#FFECEC' },
  MEDIA: { label: 'Média', color: COLORS.warning, background: '#FFF4E5' },
  BAIXA: { label: 'Baixa', color: COLORS.success, background: '#E9F8EF' },
};

const formatarDataLocal = (data) => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const getDataHojeLocal = () => formatarDataLocal(new Date());

const getFimDoMesLocal = (referencia = new Date()) => {
  const ultimoDia = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
  return formatarDataLocal(ultimoDia);
};

const normalizarDataExibicao = (valor, fallback) => {
  if (!valor || typeof valor !== 'string') return fallback;
  const isoMatch = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, ano, mes, dia] = isoMatch;
    return `${dia}/${mes}/${ano}`;
  }

  const brMatch = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) return valor;

  return fallback;
};

const parseDataEntrada = (valor) => {
  if (!valor || typeof valor !== 'string') return null;
  const isoMatch = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const brMatch = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  let dia;
  let mes;
  let ano;

  if (isoMatch) {
    [, ano, mes, dia] = isoMatch;
  } else if (brMatch) {
    [, dia, mes, ano] = brMatch;
  } else {
    return null;
  }

  const diaNum = Number(dia);
  const mesNum = Number(mes);
  const anoNum = Number(ano);

  if (!diaNum || !mesNum || !anoNum) return null;

  const data = new Date(anoNum, mesNum - 1, diaNum);
  if (data.getFullYear() !== anoNum || data.getMonth() !== mesNum - 1 || data.getDate() !== diaNum) {
    return null;
  }

  return data;
};

const TelaAdicionarObjetivo = ({ navigation }) => {
  const [tipo, setTipo] = useState('LIMITE_GASTO');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [dataInicio, setDataInicio] = useState(normalizarDataExibicao(getDataHojeLocal(), getDataHojeLocal()));
  const [dataFim, setDataFim] = useState(normalizarDataExibicao(getFimDoMesLocal(), getFimDoMesLocal()));
  const [prioridade, setPrioridade] = useState('');
  const [avisoVisivel, setAvisoVisivel] = useState(false);
  const [avisoTitulo, setAvisoTitulo] = useState('Aviso');
  const [avisoMensagem, setAvisoMensagem] = useState('');
  const [avisoOnClose, setAvisoOnClose] = useState(null);

  const abrirAviso = (titulo, mensagem, onClose) => {
    setAvisoTitulo(titulo);
    setAvisoMensagem(mensagem);
    setAvisoOnClose(() => onClose || null);
    setAvisoVisivel(true);
  };

  const handleSalvar = () => {
    const dataInicioDate = parseDataEntrada(dataInicio);
    const dataFimDate = parseDataEntrada(dataFim);

    if (!dataInicioDate || !dataFimDate) {
      abrirAviso('Datas inválidas', 'Informe datas válidas no formato DD/MM/AAAA.');
      return;
    }

    if (dataFimDate < dataInicioDate) {
      abrirAviso('Período inválido', 'A data final não pode ser menor que a data inicial.');
      return;
    }

    abrirAviso('Objetivo criado', 'Seu objetivo foi adicionado com sucesso.', () => navigation.goBack());
  };

  const prioridadeVisual = PRIORIDADE_VISUAL[prioridade] || null;
  const dataInicioDate = parseDataEntrada(dataInicio);
  const dataFimDate = parseDataEntrada(dataFim);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={() => navigation.goBack()}>
        Adicionar objetivo
      </TituloPagina>

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Tipo do objetivo</Text>
            <View style={styles.typeButtons}>
              {TIPOS_OBJETIVO.map((opcao) => {
                const ativo = tipo === opcao.id;
                return (
                  <TouchableOpacity
                    key={opcao.id}
                    style={[styles.typeButton, ativo && styles.typeButtonActive]}
                    onPress={() => setTipo(opcao.id)}
                  >
                    <Text style={[styles.typeButtonText, ativo && styles.typeButtonTextActive]}>
                      {opcao.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Gastar no máximo R$ 450 com delivery"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Alimentação"
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
            <Text style={styles.helperText}>Valor total do objetivo no período.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Data inicial</Text>
            <DatePickerInput
              value={dataInicio}
              onChangeDate={setDataInicio}
              placeholder="DD/MM/AAAA"
              style={styles.datePickerInput}
              maxDate={dataFimDate || undefined}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Data final</Text>
            <DatePickerInput
              value={dataFim}
              onChangeDate={setDataFim}
              placeholder="DD/MM/AAAA"
              style={styles.datePickerInput}
              minDate={dataInicioDate || undefined}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Prioridade (opcional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={prioridade}
                onValueChange={(value) => setPrioridade(value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione" value="" />
                {PRIORIDADES.map((opcao) => (
                  <Picker.Item key={opcao.id} label={opcao.label} value={opcao.id} />
                ))}
              </Picker>
            </View>
            {prioridadeVisual ? (
              <View style={[styles.priorityBadge, { backgroundColor: prioridadeVisual.background }]}>
                <View style={[styles.priorityDot, { backgroundColor: prioridadeVisual.color }]} />
                <Text style={[styles.priorityBadgeText, { color: prioridadeVisual.color }]}>
                  {prioridadeVisual.label}
                </Text>
              </View>
            ) : (
              <Text style={styles.priorityHelper}>Selecione a prioridade do objetivo.</Text>
            )}
          </View>
        </ScrollView>

        <BotoesAcaoFixo primaryLabel="Salvar objetivo" onPrimaryPress={handleSalvar} />
      </View>
      <ModalAviso
        visible={avisoVisivel}
        onClose={() => {
          setAvisoVisivel(false);
          if (avisoOnClose) {
            avisoOnClose();
            setAvisoOnClose(null);
          }
        }}
        titulo={avisoTitulo}
        mensagem={avisoMensagem}
      />
    </SafeAreaView>
  );
};

export default TelaAdicionarObjetivo;
