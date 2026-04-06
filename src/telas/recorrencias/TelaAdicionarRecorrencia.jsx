import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { useGerenciarRecorrencias } from './hooks/useGerenciarRecorrencias';
import { useGerenciarCategorias } from '../categorias/hooks/useGerenciarCategorias';
import { useGerenciarInstituicoes } from '../carteira/hooks/useGerenciarInstituicoes';
import {
  OPCOES_FREQUENCIA,
  OPCOES_TIPO_LIMITE,
  MENSAGENS_VALIDACAO,
} from './constants/constantesRecorrencia';
import { styles } from './styles/TelaRecorrencias.styles';

const TelaAdicionarRecorrencia = ({ navigation }) => {
  const { criarRecorrencia, isSaving, validarRecorrencia } = useGerenciarRecorrencias();
  const { categorias } = useGerenciarCategorias();
  const { instituicoes } = useGerenciarInstituicoes();

  const [formData, setFormData] = useState({
    descricao: '',
    frequencia: 'MENSAL',
    intervalo: 1,
    dia_inicio: new Date().toISOString().split('T')[0],
    tipo_limite: 'INDEFINIDA',
    data_fim: null,
    qtd_ocorrencias: null,
    valor: '',
    tipo: 'GASTO',
    fk_categoria: null,
    fk_instituicao: null,
  });

  const [erros, setErros] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState('dia_inicio');

  const handleVoltar = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpa erro do campo ao editar
    if (erros[field]) {
      setErros((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [erros]);

  const handleDateChange = (event, date) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      handleChange(datePickerType, dateString);
    }
    setShowDatePicker(false);
  };

  const openDatePicker = (field) => {
    setDatePickerType(field);
    setShowDatePicker(true);
  };

  const validarForm = useCallback(() => {
    const novoErros = {};

    if (!formData.descricao?.trim()) {
      novoErros.descricao = MENSAGENS_VALIDACAO.descricaoObrigatoria;
    }

    if (!formData.valor) {
      novoErros.valor = MENSAGENS_VALIDACAO.valorObrigatorio;
    } else if (parseFloat(formData.valor) <= 0) {
      novoErros.valor = MENSAGENS_VALIDACAO.valorMaiorQueZero;
    }

    if (!formData.fk_categoria) {
      novoErros.fk_categoria = MENSAGENS_VALIDACAO.categoriaObrigatoria;
    }

    if (!formData.fk_instituicao) {
      novoErros.fk_instituicao = MENSAGENS_VALIDACAO.instituicaoObrigatoria;
    }

    if (formData.intervalo < 1 || formData.intervalo > 365) {
      novoErros.intervalo = MENSAGENS_VALIDACAO.intervaloInvalido;
    }

    if (formData.tipo_limite === 'DATA' && !formData.data_fim) {
      novoErros.data_fim = MENSAGENS_VALIDACAO.dataFimObrigatoria;
    }

    if (formData.tipo_limite === 'OCORRENCIAS' && !formData.qtd_ocorrencias) {
      novoErros.qtd_ocorrencias = MENSAGENS_VALIDACAO.qtdOcorrenciasObrigatoria;
    } else if (formData.qtd_ocorrencias && parseInt(formData.qtd_ocorrencias) <= 0) {
      novoErros.qtd_ocorrencias = MENSAGENS_VALIDACAO.qtdOcorrenciasMaiorQueZero;
    }

    const dataInicio = new Date(formData.dia_inicio);
    const dataFim = formData.data_fim ? new Date(formData.data_fim) : null;

    if (dataFim && dataFim < dataInicio) {
      novoErros.data_fim = MENSAGENS_VALIDACAO.dataFimMenorQueInicio;
    }

    setErros(novoErros);
    return Object.keys(novoErros).length === 0;
  }, [formData]);

  const handleSalvar = useCallback(async () => {
    if (!validarForm()) {
      return;
    }

    const payload = {
      ...formData,
      valor: parseFloat(formData.valor),
      qtd_ocorrencias: formData.tipo_limite === 'OCORRENCIAS' ? parseInt(formData.qtd_ocorrencias) : null,
      data_fim: formData.tipo_limite === 'DATA' ? formData.data_fim : null,
    };

    const erro = validarRecorrencia(payload);
    if (erro) {
      setErros({ form: erro });
      return;
    }

    const criada = await criarRecorrencia(payload);
    if (criada) {
      navigation.goBack();
    }
  }, [formData, validarRecorrencia, criarRecorrencia, validarForm, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={handleVoltar}>
        Nova Recorrência
      </TituloPagina>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {erros.form && (
          <View style={{ marginBottom: 12, paddingHorizontal: 4 }}>
            <Text style={styles.errorText}>{erros.form}</Text>
          </View>
        )}

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, erros.descricao && styles.inputError]}
            placeholder="Digite a descrição"
            value={formData.descricao}
            onChangeText={(text) => handleChange('descricao', text)}
            placeholderTextColor="#999999"
          />
          {erros.descricao && <Text style={styles.errorText}>{erros.descricao}</Text>}
        </View>

        {/* Valor */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={[styles.input, erros.valor && styles.inputError]}
            placeholder="0,00"
            value={formData.valor}
            onChangeText={(text) => handleChange('valor', text)}
            keyboardType="decimal-pad"
            placeholderTextColor="#999999"
          />
          {erros.valor && <Text style={styles.errorText}>{erros.valor}</Text>}
        </View>

        {/* Tipo (Gasto/Receita) */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.radioGroup}>
            {['GASTO', 'RECEITA'].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.radioOption,
                  formData.tipo === tipo && styles.radioOptionSelected,
                ]}
                onPress={() => handleChange('tipo', tipo)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.tipo === tipo && styles.radioCircleSelected,
                  ]}
                >
                  {formData.tipo === tipo && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={styles.radioLabel}>{tipo === 'GASTO' ? 'Gasto' : 'Receita'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoria</Text>
          <View style={[styles.input, { paddingHorizontal: 0, paddingVertical: 0 }]}>
            <TouchableOpacity
              style={{ paddingHorizontal: 16, paddingVertical: 16 }}
              onPress={() => {
                // TODO: Implementar seletor de categoria
              }}
            >
              <Text style={{ color: formData.fk_categoria ? '#000' : '#999' }}>
                {categorias.find((c) => c.id === formData.fk_categoria)?.nome ||
                  'Selecione uma categoria'}
              </Text>
            </TouchableOpacity>
          </View>
          {erros.fk_categoria && <Text style={styles.errorText}>{erros.fk_categoria}</Text>}
        </View>

        {/* Instituição */}
        <View style={styles.section}>
          <Text style={styles.label}>Instituição / Conta</Text>
          <View style={[styles.input, { paddingHorizontal: 0, paddingVertical: 0 }]}>
            <TouchableOpacity
              style={{ paddingHorizontal: 16, paddingVertical: 16 }}
              onPress={() => {
                // TODO: Implementar seletor de instituição
              }}
            >
              <Text style={{ color: formData.fk_instituicao ? '#000' : '#999' }}>
                {instituicoes.find((i) => i.id === formData.fk_instituicao)?.nome ||
                  'Selecione uma instituição'}
              </Text>
            </TouchableOpacity>
          </View>
          {erros.fk_instituicao && (
            <Text style={styles.errorText}>{erros.fk_instituicao}</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Frequência</Text>

        {/* Tipo de Frequência */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.radioGroup}>
            {OPCOES_FREQUENCIA.map((opcao) => (
              <TouchableOpacity
                key={opcao.value}
                style={[
                  styles.radioOption,
                  formData.frequencia === opcao.value && styles.radioOptionSelected,
                ]}
                onPress={() => handleChange('frequencia', opcao.value)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.frequencia === opcao.value && styles.radioCircleSelected,
                  ]}
                >
                  {formData.frequencia === opcao.value && (
                    <View style={styles.radioInnerCircle} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.radioLabel}>{opcao.label}</Text>
                  <Text style={styles.radioDescription}>{opcao.descricao}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intervalo */}
        <View style={styles.section}>
          <Text style={styles.label}>Intervalo</Text>
          <TextInput
            style={[styles.input, erros.intervalo && styles.inputError]}
            placeholder="1"
            value={formData.intervalo.toString()}
            onChangeText={(text) => handleChange('intervalo', parseInt(text) || 1)}
            keyboardType="number-pad"
            placeholderTextColor="#999999"
          />
          <Text style={styles.helperText}>
            {formData.frequencia === 'DIARIA' && 'A cada N dias'}
            {formData.frequencia === 'SEMANAL' && 'A cada N semanas'}
            {formData.frequencia === 'MENSAL' && 'A cada N meses'}
            {formData.frequencia === 'ANUAL' && 'A cada N anos'}
          </Text>
          {erros.intervalo && <Text style={styles.errorText}>{erros.intervalo}</Text>}
        </View>

        {/* Data de Início */}
        <View style={styles.section}>
          <Text style={styles.label}>Data de Início</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => openDatePicker('dia_inicio')}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: 16 }}>
                {new Date(formData.dia_inicio).toLocaleDateString('pt-BR')}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#5BA3FF" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Limite</Text>

        {/* Tipo de Limite */}
        <View style={styles.section}>
          <View style={styles.radioGroup}>
            {OPCOES_TIPO_LIMITE.map((opcao) => (
              <TouchableOpacity
                key={opcao.value}
                style={[
                  styles.radioOption,
                  formData.tipo_limite === opcao.value && styles.radioOptionSelected,
                ]}
                onPress={() => handleChange('tipo_limite', opcao.value)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.tipo_limite === opcao.value && styles.radioCircleSelected,
                  ]}
                >
                  {formData.tipo_limite === opcao.value && (
                    <View style={styles.radioInnerCircle} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.radioLabel}>{opcao.label}</Text>
                  <Text style={styles.radioDescription}>{opcao.descricao}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Data Fim (se tipo_limite === 'DATA') */}
        {formData.tipo_limite === 'DATA' && (
          <View style={styles.section}>
            <Text style={styles.label}>Data de Término</Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => openDatePicker('data_fim')}
            >
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Text style={{ color: formData.data_fim ? '#000' : '#999', fontSize: 16 }}>
                  {formData.data_fim
                    ? new Date(formData.data_fim).toLocaleDateString('pt-BR')
                    : 'Selecione uma data'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#5BA3FF" />
              </View>
            </TouchableOpacity>
            {erros.data_fim && <Text style={styles.errorText}>{erros.data_fim}</Text>}
          </View>
        )}

        {/* Qtd Ocorrências (se tipo_limite === 'OCORRENCIAS') */}
        {formData.tipo_limite === 'OCORRENCIAS' && (
          <View style={styles.section}>
            <Text style={styles.label}>Quantidade de Ocorrências</Text>
            <TextInput
              style={[styles.input, erros.qtd_ocorrencias && styles.inputError]}
              placeholder="0"
              value={formData.qtd_ocorrencias?.toString() || ''}
              onChangeText={(text) =>
                handleChange('qtd_ocorrencias', text ? parseInt(text) : null)
              }
              keyboardType="number-pad"
              placeholderTextColor="#999999"
            />
            {erros.qtd_ocorrencias && (
              <Text style={styles.errorText}>{erros.qtd_ocorrencias}</Text>
            )}
          </View>
        )}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(
            datePickerType === 'dia_inicio' ? formData.dia_inicio : formData.data_fim || new Date()
          )}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <BotoesAcaoFixo
        primaryLabel="Criar Recorrência"
        primaryLoadingLabel="Criando..."
        onPrimaryPress={handleSalvar}
        primaryDisabled={isSaving}
        primaryLoading={isSaving}
        secondaryLabel="Cancelar"
        onSecondaryPress={handleVoltar}
      />
    </SafeAreaView>
  );
};

export default TelaAdicionarRecorrencia;
