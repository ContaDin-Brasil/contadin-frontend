import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, ActivityIndicator, Alert, Image, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TituloPagina from '../../componentes/TituloPagina';
import BotoesAcaoFixo from '../../componentes/BotoesAcaoFixo';
import { DatePickerInput } from '../../componentes/DatePickerInput';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import ModalSelecaoInstituicao from '../../componentes/modais/ModalSelecaoInstituicao';
import ModalAdicionarInstituicao from '../../componentes/modais/ModalAdicionarInstituicao';
import ModalConfirmDelete from '../../componentes/modais/ModalConfirmDelete';
import ModalCategoria from '../categorias/modals/ModalCategoria';
import { useEditarTransacao } from './hooks/useEditarTransacao';
import { FREQUENCIES, INSTALLMENT_OPTIONS } from './constants/constantesTransacao';
import { getCategoryIcon } from './utils/utilitariosTransacao';
import { categoriaService, recorrenciaService } from '../../api';
import COLORS from '../../styles/colors';
import { styles } from './styles/TelaAdicionarTransacao.styles';

const TelaEditarTransacao = ({ navigation, route }) => {
  const transacaoId = route.params?.transacaoId || null;
  
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeletando, setIsDeletando] = useState(false);

  // Hook customizado para edição
  const editState = useEditarTransacao(transacaoId);

  const handleSelectInstitution = (institution) => {
    editState.handleSelectInstitution(institution);
    setSelectionModalVisible(false);
  };

  const handleAddCustomInstitution = (institution) => {
    editState.handleAddCustomInstitution(institution);
    setCustomModalVisible(false);
  };

  const handleCreateCategoria = async (data) => {
    try {
      await categoriaService.criar({
        ...data,
        fk_usuario: 1 // ID do usuário
      });
      
      // Recarrega categorias
      await editState.carregarDados();
      
      Alert.alert('Sucesso', 'Categoria criada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      Alert.alert('Erro', 'Não foi possível criar a categoria');
      return false;
    }
  };

  const handleUpdateTransaction = async () => {
    setSalvando(true);
    
    try {
      // Valida data limite de recorrência antes de atualizar
      const dataLimiteError = editState.validateRecurrenceEndDate();
      if (dataLimiteError) {
        Alert.alert('Erro', dataLimiteError);
        setSalvando(false);
        return;
      }

      // Valida configurações de parcelamento
      const parcelamentoError = editState.validateInstallment();
      if (parcelamentoError) {
        Alert.alert('Erro', parcelamentoError);
        setSalvando(false);
        return;
      }

      await editState.atualizarTransacao();
      
      Alert.alert('Sucesso', 'Transação atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar a transação');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeleteTransaction = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDeleteTransaction = async () => {
    setIsDeletando(true);
    try {
      await editState.deletarTransacao();
      setDeleteModalVisible(false);
      setIsDeletando(false);
      Alert.alert('Sucesso', 'Transação excluída com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      // Fallback para web onde Alert pode não funcionar
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      setDeleteModalVisible(false);
      setIsDeletando(false);
      Alert.alert('Erro', error.message || 'Não foi possível excluir a transação');
    }
  };

  // Mostra loading enquanto carrega a transação
  if (editState.loadingTransacao || editState.loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TituloPagina 
          mostrarBotaoVoltar={true} 
          onVoltar={() => navigation.goBack()}
        >
          Editar Transação
        </TituloPagina>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: '#666' }}>Carregando transação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Se não encontrou a transação
  if (!transacaoId || !editState.transacaoOriginal) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TituloPagina 
          mostrarBotaoVoltar={true} 
          onVoltar={() => navigation.goBack()}
        >
          Editar Transação
        </TituloPagina>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Ionicons name="alert-circle-outline" size={64} color="#E31C23" />
          <Text style={{ marginTop: 16, color: '#E31C23', textAlign: 'center' }}>
            Transação não encontrada
          </Text>
          <TouchableOpacity 
            style={[styles.saveButton, { marginTop: 20, width: 'auto', paddingHorizontal: 30 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.saveButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={() => navigation.goBack()}
      >
        Editar Transação
      </TituloPagina>
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >

      {/* Descrição da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Descrição da transação:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Salário Avanade"
          placeholderTextColor="#999"
          value={editState.descricao}
          onChangeText={editState.setDescricao}
        />
      </View>

      {/* Valor da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Valor:</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>R$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0,00"
            placeholderTextColor="#999"
            value={editState.valor}
            onChangeText={editState.handleValorChange}
            onBlur={editState.handleValorBlur}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Data da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Data:</Text>
        <View style={styles.dateInputContainer}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primaryLight} />
          <TextInput
            style={styles.dateInput}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
            value={editState.date}
            onChangeText={editState.handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Tipo da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Tipo da transação:</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              editState.tipo === 'GASTO' && styles.typeButtonActive
            ]}
            onPress={() => editState.setTipo('GASTO')}
          >
            <Text style={[
              styles.typeButtonText,
              editState.tipo === 'GASTO' && styles.typeButtonTextActive
            ]}>
              Gasto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButtonIncome,
              editState.tipo === 'RECEITA' && styles.typeButtonActive
            ]}
            onPress={() => editState.setTipo('RECEITA')}
          >
            <Text style={[
              styles.typeButtonText,
              editState.tipo === 'RECEITA' && styles.typeButtonTextActive
            ]}>
              Receita
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categoria */}
      <View style={styles.section}>
        <Text style={styles.label}>Categoria:</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar categorias..."
            placeholderTextColor="#999"
            value={editState.categorySearch}
            onChangeText={editState.setCategorySearch}
          />
        </View>
        <View style={styles.categoryButtons}>
          {editState.getCategoriasExibidas().map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                editState.selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => editState.setSelectedCategory(category.id)}
            >
              <MaterialIcons
                name={category.icone || getCategoryIcon(category.nome)}
                size={20}
                color={editState.selectedCategory === category.id ? '#FFF' : '#333'}
              />
              <Text style={[
                styles.categoryButtonText,
                editState.selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.nome}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Botão Adicionar Categoria */}
          <TouchableOpacity
            style={[styles.categoryButton, styles.addCategoryButton]}
            onPress={() => editState.setModalCategoriaVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.categoryButtonText, styles.addCategoryButtonText]}>
              Adicionar Categoria
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recorrência e Parcelamento */}
      <View style={styles.section}>
        {/* Seletor de Modo */}
        <Text style={styles.label}>Tipo de repetição:</Text>
        <View style={styles.typeButtons}>
          {['NONE', 'RECORRENCIA', 'PARCELADO'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.typeButton,
                editState.recurringMode === mode && styles.typeButtonActive
              ]}
              onPress={() => editState.setRecurringMode(mode)}
            >
              <Text style={[
                styles.typeButtonText,
                editState.recurringMode === mode && styles.typeButtonTextActive
              ]}>
                {mode === 'NONE' ? 'Nenhuma' : mode === 'RECORRENCIA' ? 'Recorrência' : 'Parcelado'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* === RECORRÊNCIA === */}
      {editState.recurringMode === 'RECORRENCIA' && (
        <>
          {/* Tipo de Frequência */}
          <View style={styles.section}>
            <Text style={styles.label}>Frequência:</Text>
            <View style={styles.frequencyButtons}>
              {FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.frequencyButton,
                    editState.frequency === freq.id && styles.frequencyButtonActive
                  ]}
                  onPress={() => editState.setFrequency(freq.id)}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    editState.frequency === freq.id && styles.frequencyButtonTextActive
                  ]}>
                    {freq.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Intervalo */}
          <View style={styles.section}>
            <Text style={styles.label}>A cada quantos?</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="1"
                placeholderTextColor="#999"
                value={editState.recurrenceInterval?.toString()}
                onChangeText={(text) => editState.setRecurrenceInterval(parseInt(text) || 1)}
                keyboardType="number-pad"
              />
              <Text style={styles.currencySymbol}>
                {editState.frequency === 'DIARIA' && 'dias'}
                {editState.frequency === 'SEMANAL' && 'semanas'}
                {editState.frequency === 'MENSAL' && 'meses'}
                {editState.frequency === 'ANUAL' && 'anos'}
              </Text>
            </View>
          </View>

          {/* APENAS INDEFINIDA ou DATA (sem OCORRENCIAS) */}
          <View style={styles.section}>
            <Text style={styles.label}>Duração:</Text>
            <View style={styles.typeButtons}>
              {['INDEFINIDA', 'DATA'].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.typeButton,
                    editState.recurrenceLimitType === tipo && styles.typeButtonActive
                  ]}
                  onPress={() => editState.setRecurrenceLimitType(tipo)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    editState.recurrenceLimitType === tipo && styles.typeButtonTextActive
                  ]}>
                    {tipo === 'INDEFINIDA' ? 'Sem limite' : 'Com data final'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data Limite (se tipo_limite === 'DATA') */}
          {editState.recurrenceLimitType === 'DATA' && (
            <View style={styles.section}>
              <Text style={styles.label}>Data de término:</Text>
              <DatePickerInput
                value={editState.recurrenceEndDate}
                onChangeDate={editState.setRecurrenceEndDate}
                placeholder="DD/MM/AAAA"
                minDate={new Date()}
                errorMessage={editState.validateRecurrenceEndDate()}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </>
      )}

      {/* === PARCELADO === */}
      {editState.recurringMode === 'PARCELADO' && (
        <>
          {/* Frequência das parcelas (informativo) */}
          <View style={styles.section}>
            <Text style={styles.label}>Frequência das parcelas:</Text>
            <View style={styles.frequencyButtons}>
              {FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.frequencyButton,
                    editState.parceladoFrequency === freq.id && styles.frequencyButtonActive
                  ]}
                  onPress={() => editState.setParceladoFrequency(freq.id)}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    editState.parceladoFrequency === freq.id && styles.frequencyButtonTextActive
                  ]}>
                    {freq.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantidade de Parcelas */}
          <View style={styles.section}>
            <Text style={styles.label}>Quantidade de parcelas:</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="12"
                placeholderTextColor="#999"
                value={editState.parceladoOccurrenceCount?.toString()}
                onChangeText={(text) => editState.setParceladoOccurrenceCount(parseInt(text) || 1)}
                keyboardType="number-pad"
              />
              <Text style={styles.currencySymbol}>parcelas</Text>
            </View>
          </View>

          {/* Preview da divisão do valor */}
          {editState.valor && (
            <View style={styles.parceladoValuePreview}>
              <Text style={styles.parceladoValueLabel}>
                {editState.parceladoOccurrenceCount}x de{' '}
                <Text style={styles.parceladoValueHighlight}>
                  R$ {(parseFloat(editState.valor) / editState.parceladoOccurrenceCount).toFixed(2).replace('.', ',')}
                </Text>
              </Text>
            </View>
          )}
        </>
      )}

      {/* Seleção de instituição */}
      <View style={styles.section}>
        <Text style={styles.label}>Instituição:</Text>
        
        <TouchableOpacity
          style={styles.institutionChipContainer}
          onPress={() => setSelectionModalVisible(true)}
          activeOpacity={0.7}
        >
          {editState.selectedInstitution ? (
            <View style={styles.institutionChipWrapper}>
              <View style={[styles.institutionChip, { borderColor: editState.selectedInstitution.cor }]}>
                {(() => {
                  const institutionLogo = getLogoByName(editState.selectedInstitution.nome);
                  return (
                    <>
                      <View style={[styles.chipIconContainer, { backgroundColor: institutionLogo ? '#FFF' : editState.selectedInstitution.cor }]}>
                        {institutionLogo ? (
                          <Image 
                            source={institutionLogo} 
                            style={styles.chipLogoImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Text style={styles.chipIconText}>{editState.selectedInstitution.icone}</Text>
                        )}
                      </View>
                      <Text style={styles.chipText}>{editState.selectedInstitution.nome}</Text>
                      <TouchableOpacity 
                        style={styles.chipRemoveButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          editState.handleSelectInstitution(null);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close-circle" size={20} color="#666" />
                      </TouchableOpacity>
                    </>
                  );
                })()}
              </View>
            </View>
          ) : (
            <View style={styles.institutionPlaceholderContainer}>
              <Ionicons name="business-outline" size={20} color="#999" />
              <Text style={styles.institutionPlaceholderText}>Toque para selecionar uma instituição</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

        </ScrollView>

        <BotoesAcaoFixo
          primaryLabel="Salvar Alterações"
          primaryLoadingLabel="Salvando..."
          onPrimaryPress={handleUpdateTransaction}
          primaryDisabled={salvando || isDeletando}
          primaryLoading={salvando}
          secondaryLabel="Excluir Transação"
          secondaryLoadingLabel="Excluindo..."
          onSecondaryPress={handleDeleteTransaction}
          secondaryDisabled={salvando || isDeletando}
          secondaryLoading={isDeletando}
          secondaryVariant="danger"
        />
      </View>

      {/* Modais */}
      <ModalSelecaoInstituicao
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        onSelectInstitution={handleSelectInstitution}
        onAddCustom={() => {
          setSelectionModalVisible(false);
          setCustomModalVisible(true);
        }}
        availableInstitutions={editState.instituicoes}
      />

      <ModalAdicionarInstituicao
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
        onAdd={handleAddCustomInstitution}
      />

      <ModalCategoria
        visible={editState.modalCategoriaVisible}
        onClose={() => editState.setModalCategoriaVisible(false)}
        onSave={handleCreateCategoria}
        tipoInicial={editState.tipo}
      />

      <ModalConfirmDelete
        visible={deleteModalVisible}
        titulo="Confirmar exclusão"
        mensagem="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDeleteTransaction}
        onClose={() => setDeleteModalVisible(false)}
        isLoading={isDeletando}
      />
    </SafeAreaView>
  );
};

export default TelaEditarTransacao;
