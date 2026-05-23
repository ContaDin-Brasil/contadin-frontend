import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { DatePickerInput } from '../../componentes/DatePickerInput';
import ModalAviso from '../../componentes/modais/ModalAviso';
import ModalCategoria from '../categorias/modals/ModalCategoria';
import { categoriaService, objetivoGastoService } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../styles/colors';
import { extrairUsuarioId, obterUsuarioIdOuErro } from '../../utils/normalizacao';
import { getCategoryIcon } from '../transacoes/utils/utilitariosTransacao';
import { converterParaNumero, formatarValorMonetario } from '../transacoes/utils/formatacaoMoeda';
import {
  PRIORIDADES,
  PRIORIDADE_VISUAL,
  TIPOS_OBJETIVO,
} from '@/telas/configuracoes/objetivos/constants/constantesObjetivo';
import {
  formatarDataISO,
  getDataHojeLocal,
  getFimDoMesLocal,
  normalizarDataExibicao,
  parseDataEntrada,
} from '@/utils/dateUtils';
import { useCategoriasObjetivo } from '@/telas/configuracoes/objetivos/hooks/useCategoriasObjetivo';
import { styles } from './styles/TelaObjetivoForm.styles';

const TelaAdicionarObjetivo = ({ navigation }) => {
  const { user } = useAuth();
  const usuarioId = extrairUsuarioId(user);
  const [tipo, setTipo] = useState('LIMITE_GASTO');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [dataInicio, setDataInicio] = useState(normalizarDataExibicao(getDataHojeLocal(), getDataHojeLocal()));
  const [dataFim, setDataFim] = useState(normalizarDataExibicao(getFimDoMesLocal(), getFimDoMesLocal()));
  const [prioridade, setPrioridade] = useState('');
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);
  const [avisoVisivel, setAvisoVisivel] = useState(false);
  const [avisoTitulo, setAvisoTitulo] = useState('Aviso');
  const [avisoMensagem, setAvisoMensagem] = useState('');
  const [avisoOnClose, setAvisoOnClose] = useState(null);
  const [isSalvando, setIsSalvando] = useState(false);
  const {
    categoriasExibidas,
    categoriaSearch,
    setCategoriaSearch,
    categoriaSelecionadaId,
    setCategoriaSelecionadaId,
    carregandoCategorias,
    categoriasErro,
    tipoCategoria,
    recarregarCategorias,
  } = useCategoriasObjetivo({
    usuarioId,
    tipoObjetivo: tipo,
  });

  const abrirAviso = (titulo, mensagem, onClose) => {
    setAvisoTitulo(titulo);
    setAvisoMensagem(mensagem);
    setAvisoOnClose(() => onClose || null);
    setAvisoVisivel(true);
  };

  const handleCreateCategoria = async (data) => {
    const usuarioIdLocal = obterUsuarioIdOuErro(extrairUsuarioId(user), (mensagem) => {
      abrirAviso('Sessao invalida', mensagem);
    });

    if (!usuarioIdLocal) return false;

    try {
      const categoriaCriada = await categoriaService.criar({
        ...data,
        fkUsuario: usuarioIdLocal,
      });

      await recarregarCategorias();
      if (categoriaCriada?.id !== undefined && categoriaCriada?.id !== null) {
        setCategoriaSelecionadaId(String(categoriaCriada.id));
      }
      setCategoriaSearch('');
      abrirAviso('Sucesso', 'Categoria criada com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      abrirAviso('Erro', 'Não foi possivel criar a categoria.');
      return false;
    }
  };

  const handleSalvar = async () => {
    if (isSalvando) return;
    const dataInicioDate = parseDataEntrada(dataInicio);
    const dataFimDate = parseDataEntrada(dataFim);
    const usuarioId = obterUsuarioIdOuErro(extrairUsuarioId(user), (mensagem) => {
      abrirAviso('Sessao invalida', mensagem);
    });

    if (!usuarioId) return;

    if (!nome.trim()) {
      abrirAviso('Nome obrigatorio', 'Informe um nome para o objetivo.');
      return;
    }

    if (!categoriaSelecionadaId) {
      abrirAviso('Categoria obrigatoria', 'Selecione uma categoria para o objetivo.');
      return;
    }

    const valorNumerico = converterParaNumero(valorAlvo);
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      abrirAviso('Valor invalido', 'Informe um valor alvo valido.');
      return;
    }

    if (!dataInicioDate || !dataFimDate) {
      abrirAviso('Datas inválidas', 'Informe datas válidas no formato DD/MM/AAAA.');
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataInicioDate < hoje) {
      abrirAviso('Data inicial inválida', 'A data inicial não pode ser no passado.');
      return;
    }

    if (dataFimDate < dataInicioDate) {
      abrirAviso('Período inválido', 'A data final não pode ser menor que a data inicial.');
      return;
    }

    const dataInicioIso = formatarDataISO(dataInicioDate);
    const dataFimIso = formatarDataISO(dataFimDate);

    if (!dataInicioIso || !dataFimIso) {
      abrirAviso('Datas inválidas', 'Não foi possível preparar as datas do objetivo.');
      return;
    }

    try {
      setIsSalvando(true);
      await objetivoGastoService.criar({
        tipoObjetivo: tipo,
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        valor: valorNumerico,
        dataInicio: dataInicioIso,
        dataFim: dataFimIso,
        prioridade: prioridade || null,
        fkCategoria: categoriaSelecionadaId,
        fkUsuario: usuarioId,
      });

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Objetivo criado com sucesso!',
        text2: nome.trim(),
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 80,
      });

      setTimeout(() => navigation.goBack(), 500);
    } catch (error) {
      abrirAviso('Erro', error.message || 'Não foi possível criar o objetivo.');
    } finally {
      setIsSalvando(false);
    }
  };

  const handleValorChange = (text) => {
    const valorFormatado = formatarValorMonetario(text);
    setValorAlvo(valorFormatado);
  };

  const handleValorBlur = () => {
    if (!valorAlvo) return;

    const valorNumerico = converterParaNumero(valorAlvo);
    const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValorAlvo(valorFormatado);
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
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Ex: Reduzir pedidos no fim de semana."
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color={COLORS.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar categorias"
                placeholderTextColor={COLORS.textTertiary}
                value={categoriaSearch}
                onChangeText={setCategoriaSearch}
              />
            </View>
            {carregandoCategorias ? (
              <Text style={styles.helperText}>Carregando categorias...</Text>
            ) : (
              <>
                {categoriasErro ? (
                  <Text style={styles.categoryEmptyText}>{categoriasErro}</Text>
                ) : categoriasExibidas.length === 0 ? (
                  <Text style={styles.categoryEmptyText}>Nenhuma categoria encontrada.</Text>
                ) : null}
                <View style={styles.categoryButtons}>
                  {categoriasExibidas.map((category) => {
                    const selecionada = String(categoriaSelecionadaId) === String(category.id);
                    const iconName = category.icone || getCategoryIcon(category.nome);

                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryButton, selecionada && styles.categoryButtonActive]}
                        onPress={() => setCategoriaSelecionadaId(String(category.id))}
                      >
                        <MaterialIcons
                          name={iconName}
                          size={18}
                          color={selecionada ? COLORS.white : COLORS.textPrimary}
                        />
                        <Text
                          style={[styles.categoryButtonText, selecionada && styles.categoryButtonTextActive]}
                        >
                          {category.nome}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={[styles.categoryButton, styles.addCategoryButton]}
                    onPress={() => setModalCategoriaVisible(true)}
                  >
                    <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
                    <Text style={[styles.categoryButtonText, styles.addCategoryButtonText]}>
                      Adicionar categoria
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
                onChangeText={handleValorChange}
                onBlur={handleValorBlur}
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

        <BotoesAcaoFixo
          primaryLabel={isSalvando ? 'Salvando...' : 'Salvar objetivo'}
          onPrimaryPress={handleSalvar}
        />
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
      <ModalCategoria
        visible={modalCategoriaVisible}
        onClose={() => setModalCategoriaVisible(false)}
        onSave={handleCreateCategoria}
        tipoInicial={tipoCategoria}
      />
    </SafeAreaView>
  );
};

export default TelaAdicionarObjetivo;
