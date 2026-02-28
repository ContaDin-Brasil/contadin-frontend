import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, ActivityIndicator, Alert, Image, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TituloPagina from '../../componentes/TituloPagina';
import { DatePickerInput } from '../../componentes/DatePickerInput';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import ModalSelecaoInstituicao from '../../componentes/modais/ModalSelecaoInstituicao';
import ModalAdicionarInstituicao from '../../componentes/modais/ModalAdicionarInstituicao';
import ModalCategoria from '../categorias/modals/ModalCategoria';
import { useEditarTransacao } from './hooks/useEditarTransacao';
import { FREQUENCIES, INSTALLMENT_OPTIONS } from './constants/constantesTransacao';
import { getCategoryIcon } from './utils/utilitariosTransacao';
import { categoriaService } from '../../api';
import COLORS from '../../styles/colors';
import { styles } from './styles/TelaAdicionarTransacao.styles';

const TelaEditarTransacao = ({ navigation, route }) => {
  const transacaoId = route.params?.transacaoId || null;
  
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);

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
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setDeletando(true);
            try {
              await editState.deletarTransacao();
              Alert.alert('Sucesso', 'Transação excluída com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error('Erro ao deletar transação:', error);
              Alert.alert('Erro', 'Não foi possível excluir a transação');
              setDeletando(false);
            }
          }
        }
      ]
    );
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

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
        {/* Toggle de Recorrência */}
        {!editState.isInstallment && (
          <View style={styles.recurringRow}>
            <Switch
              value={editState.isRecurring}
              onValueChange={editState.handleToggleRecurring}
              trackColor={{ false: COLORS.borderDark, true: COLORS.primaryLight }}
              thumbColor={COLORS.white}
            />
            <Text style={styles.recurringText}>Recorrência</Text>
          </View>
        )}
        {editState.isRecurring && (
          <>
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
            <View style={styles.recurringRow}>
              <Switch
                value={editState.hasRecurrenceEndDate}
                onValueChange={editState.setHasRecurrenceEndDate}
                trackColor={{ false: COLORS.borderDark, true: COLORS.primaryLight }}
                thumbColor={COLORS.white}
              />
              <Text style={styles.recurringText}>Data limite da recorrência</Text>
            </View>
            {editState.hasRecurrenceEndDate && (
              <DatePickerInput
                value={editState.recurrenceEndDate}
                onChangeDate={editState.handleRecurrenceEndDateChange}
                placeholder="DD/MM/AAAA"
                minDate={new Date()} // Não permite datas passadas
                errorMessage={editState.validateRecurrenceEndDate()}
                style={{ marginTop: 8 }}
              />
            )}
          </>
        )}

        {/* Toggle de Parcelamento */}
        {!editState.isRecurring && (
          <View style={[styles.recurringRow, editState.isInstallment && styles.marginTop0]}>
            <Switch
              value={editState.isInstallment}
              onValueChange={editState.handleToggleInstallment}
              trackColor={{ false: COLORS.borderDark, true: COLORS.primaryLight }}
              thumbColor={COLORS.white}
            />
            <Text style={styles.recurringText}>Parcelado</Text>
          </View>
        )}
        {editState.isInstallment && (
          <>
            {/* Valor por parcela */}
            {editState.valor && editState.getInstallmentValue() > 0 && (
              <View style={styles.installmentValueContainer}>
                <View style={styles.installmentValueRow}>
                  <Ionicons name="calculator-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.installmentValueText}>
                    {editState.installmentCount === 0 
                      ? (editState.customInstallmentValue || '?')
                      : editState.installmentCount}x de{' '}
                    <Text style={styles.installmentValueHighlight}>
                      R$ {editState.getInstallmentValue().toFixed(2).replace('.', ',')}
                    </Text>
                  </Text>
                </View>
                {editState.getInstallmentWarning() && (
                  <View style={styles.warningContainer}>
                    <Ionicons name="alert-circle-outline" size={14} color={COLORS.warning} />
                    <Text style={styles.warningText}>{editState.getInstallmentWarning()}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Seletor de parcelas */}
            <Text style={styles.pickerLabel}>Quantidade de parcelas:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editState.installmentCount}
                onValueChange={(itemValue) => {
                  editState.setInstallmentCount(itemValue);
                  // Limpa o valor customizado quando seleciona uma opção pré-definida
                  if (itemValue !== 0) {
                    editState.setCustomInstallmentValue('');
                  }
                }}
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                {INSTALLMENT_OPTIONS.map(option => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>

            {/* Campo customizado quando seleciona "Outro valor" */}
            {editState.installmentCount === 0 && (
              <View style={styles.customInstallmentContainer}>
                <Text style={styles.label}>Digite a quantidade de parcelas (máx. 720):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 24"
                  placeholderTextColor="#999"
                  value={editState.customInstallmentValue}
                  onChangeText={editState.handleCustomInstallmentChange}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            )}

            {/* Validação de parcelamento */}
            {editState.validateInstallment() && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={COLORS.error} />
                <Text style={styles.errorText}>{editState.validateInstallment()}</Text>
              </View>
            )}

            {/* Data da última parcela (info) */}
            {editState.getLastInstallmentDate() && !editState.validateInstallment() && (
              <View style={styles.installmentInfoContainer}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.installmentInfoText}>
                  Última parcela: {editState.getLastInstallmentDate()}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

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

      {/* Botões de Ação */}
      <View style={{ marginBottom: 30 }}>
        {/* Botão Salvar Alterações */}
        <TouchableOpacity 
          style={[styles.saveButton, salvando && { opacity: 0.6 }]} 
          onPress={handleUpdateTransaction}
          disabled={salvando || deletando}
        >
          {salvando ? (
            <>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>Salvando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="#FFF" />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Botão Deletar */}
        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: '#FFF', 
            borderWidth: 2, 
            borderColor: COLORS.error,
            marginTop: 12
          }, deletando && { opacity: 0.6 }]} 
          onPress={handleDeleteTransaction}
          disabled={salvando || deletando}
        >
          {deletando ? (
            <>
              <ActivityIndicator size="small" color={COLORS.error} />
              <Text style={[styles.saveButtonText, { color: COLORS.error, marginLeft: 8 }]}>Excluindo...</Text>
            </>
          ) : (
            <>
              <Ionicons name="trash-outline" size={24} color={COLORS.error} />
              <Text style={[styles.saveButtonText, { color: COLORS.error }]}>Excluir Transação</Text>
            </>
          )}
        </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default TelaEditarTransacao;
