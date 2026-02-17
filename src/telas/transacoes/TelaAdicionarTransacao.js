import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Animated, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import ModalSelecaoInstituicao from '../../componentes/modais/ModalSelecaoInstituicao';
import ModalAdicionarInstituicao from '../../componentes/modais/ModalAdicionarInstituicao';
import { useFormularioTransacao } from './hooks/useFormularioTransacao';
import { useProcessamentoIA } from './hooks/useProcessamentoIA';
import { transacaoService } from '../../api';
import { FREQUENCIES, INSTALLMENT_OPTIONS } from './constants/constantesTransacao';
import { getCategoryIcon } from './utils/utilitariosTransacao';
import { styles } from './styles/TelaAdicionarTransacao.styles';

const TelaAdicionarTransacao = ({ navigation }) => {
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Hooks customizados
  const formState = useFormularioTransacao();
  const aiState = useProcessamentoIA();

  const handleSelectInstitution = (institution) => {
    formState.handleSelectInstitution(institution);
    setSelectionModalVisible(false);
  };

  const handleAddCustomInstitution = (institution) => {
    formState.handleAddCustomInstitution(institution);
    setCustomModalVisible(false);
  };

  const applyAISuggestion = () => {
    if (aiState.aiSuggestion) {
      formState.applyAISuggestion(aiState.aiSuggestion);
      aiState.dismissAISuggestion();
    }
  };

  const handleSaveTransaction = async () => {
    setSalvando(true);
    
    try {
      const data = formState.getFormData();
      
      // Valida dados básicos
      if (!data.descricao || !data.valor) {
        Alert.alert('Erro', 'Preencha descrição e valor');
        setSalvando(false);
        return;
      }

      // Valida se uma instituição foi selecionada
      if (!data.selectedInstitution) {
        Alert.alert('Erro', 'Selecione uma instituição');
        setSalvando(false);
        return;
      }

      // Converte data DD/MM/YYYY para ISO
      const [day, month, year] = data.date.split('/');
      const dataISO = new Date(`${year}-${month}-${day}`).toISOString();

      // Converte data fim de recorrência se houver
      let fimRecorrenciaISO = null;
      if (data.hasRecurrenceEndDate && data.recurrenceEndDate) {
        const [endDay, endMonth, endYear] = data.recurrenceEndDate.split('/');
        fimRecorrenciaISO = new Date(`${endYear}-${endMonth}-${endDay}`).toISOString();
      }

      // Prepara dados para envio
      const transacao = {
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        tipo: data.tipo,
        data_transacao: dataISO,
        parcelado: data.parcelado,
        qtdParcelas: data.qtdParcelas,
        recorrencia: data.isRecurring ? data.frequency : null,
        fim_recorrencia: fimRecorrenciaISO,
        fk_instituicao: data.selectedInstitution.id,
        fk_categoria: data.selectedCategory,
      };

      console.log('💾 Salvando transação:', transacao);

      await transacaoService.criar(transacao);
      
      Alert.alert('Sucesso', 'Transação criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      Alert.alert('Erro', 'Não foi possível salvar a transação');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Adicione uma Transação</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Botões de OCR/Áudio */}
      <View style={styles.aiSection}>
        <Text style={styles.aiSectionTitle}>✨ Adicionar via IA</Text>
        <View style={styles.aiButtons}>
          <TouchableOpacity 
            style={styles.aiButton}
            onPress={aiState.handlePhotoOCR}
            disabled={aiState.isProcessing}
          >
            <Ionicons name="camera" size={24} color="#5BA3FF" />
            <Text style={styles.aiButtonText}>Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.aiButton}
            onPress={aiState.handleAudioInput}
            disabled={aiState.isProcessing}
          >
            <Ionicons name="mic" size={24} color="#5BA3FF" />
            <Text style={styles.aiButtonText}>Áudio</Text>
          </TouchableOpacity>
        </View>

        {/* Indicador de processamento */}
        {aiState.isProcessing && (
          <View style={styles.processingCard}>
            <View style={styles.processingHeader}>
              <Animated.View style={[
                styles.loadingDot, 
                { transform: [{ scale: aiState.pulseAnim }] }
              ]} />
              <Text style={styles.processingText}>
                {aiState.processingType === 'photo' ? 'Analisando foto...' : 'Transcrevendo áudio...'}
              </Text>
            </View>
            <Text style={styles.processingSubtext}>
              A IA está extraindo as informações da transação
            </Text>
          </View>
        )}

        {/* Card de sugestão da IA */}
        {aiState.aiSuggestion && !aiState.isProcessing && (
          <View style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Ionicons name="sparkles" size={20} color="#5BA3FF" />
              <Text style={styles.suggestionTitle}>Sugestão da IA</Text>
            </View>
            <View style={styles.suggestionContent}>
              <View style={styles.suggestionRow}>
                <Text style={styles.suggestionLabel}>Descrição:</Text>
                <Text style={styles.suggestionValue}>{aiState.aiSuggestion.descricao}</Text>
              </View>
              <View style={styles.suggestionRow}>
                <Text style={styles.suggestionLabel}>Valor:</Text>
                <Text style={styles.suggestionValue}>{aiState.aiSuggestion.valor}</Text>
              </View>
              {aiState.aiSuggestion.data && (
                <View style={styles.suggestionRow}>
                  <Text style={styles.suggestionLabel}>Data:</Text>
                  <Text style={styles.suggestionValue}>{aiState.aiSuggestion.data}</Text>
                </View>
              )}
              <View style={styles.suggestionRow}>
                <Text style={styles.suggestionLabel}>Tipo:</Text>
                <Text style={styles.suggestionValue}>
                  {aiState.aiSuggestion.tipo === 'RECEITA' ? 'Receita' : 'Gasto'}
                </Text>
              </View>
            </View>
            <View style={styles.suggestionButtons}>
              <TouchableOpacity 
                style={styles.suggestionButtonReject}
                onPress={aiState.dismissAISuggestion}
              >
                <Text style={styles.suggestionButtonRejectText}>Descartar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestionButtonAccept}
                onPress={applyAISuggestion}
              >
                <Ionicons name="checkmark" size={18} color="#FFF" />
                <Text style={styles.suggestionButtonAcceptText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Descrição da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Descrição da transação:</Text>
        <TextInput
          style={styles.input}
          placeholder="Salário Avanade"
          placeholderTextColor="#999"
          value={formState.descricao}
          onChangeText={formState.setDescricao}
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
            value={formState.valor}
            onChangeText={formState.setValor}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Data da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Data:</Text>
        <View style={styles.dateInputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#5BA3FF" />
          <TextInput
            style={styles.dateInput}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
            value={formState.date}
            onChangeText={formState.handleDateChange}
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
              formState.tipo === 'GASTO' && styles.typeButtonActive
            ]}
            onPress={() => formState.setTipo('GASTO')}
          >
            <Text style={[
              styles.typeButtonText,
              formState.tipo === 'GASTO' && styles.typeButtonTextActive
            ]}>
              Gasto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButtonIncome,
              formState.tipo === 'RECEITA' && styles.typeButtonActive
            ]}
            onPress={() => formState.setTipo('RECEITA')}
          >
            <Text style={[
              styles.typeButtonText,
              formState.tipo === 'RECEITA' && styles.typeButtonTextActive
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
            placeholder="Pesquisar"
            placeholderTextColor="#999"
            value={formState.categorySearch}
            onChangeText={formState.setCategorySearch}
          />
        </View>
        <View style={styles.categoryButtons}>
          {formState.categorias.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                formState.selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => formState.setSelectedCategory(category.id)}
            >
              <Ionicons
                name={getCategoryIcon(category.nome)}
                size={20}
                color={formState.selectedCategory === category.id ? '#FFF' : '#333'}
              />
              <Text style={[
                styles.categoryButtonText,
                formState.selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recorrência e Parcelamento */}
      <View style={styles.section}>
        {/* Toggle de Recorrência */}
        {!formState.isInstallment && (
          <View style={styles.recurringRow}>
            <Switch
              value={formState.isRecurring}
              onValueChange={formState.handleToggleRecurring}
              trackColor={{ false: '#D0D0D0', true: '#5BA3FF' }}
              thumbColor="#FFF"
            />
            <Text style={styles.recurringText}>Recorrência</Text>
          </View>
        )}
        {formState.isRecurring && (
          <>
            <View style={styles.frequencyButtons}>
              {FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.frequencyButton,
                    formState.frequency === freq.id && styles.frequencyButtonActive
                  ]}
                  onPress={() => formState.setFrequency(freq.id)}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    formState.frequency === freq.id && styles.frequencyButtonTextActive
                  ]}>
                    {freq.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.recurringRow}>
              <Switch
                value={formState.hasRecurrenceEndDate}
                onValueChange={formState.setHasRecurrenceEndDate}
                trackColor={{ false: '#D0D0D0', true: '#5BA3FF' }}
                thumbColor="#FFF"
              />
              <Text style={styles.recurringText}>Data limite da recorrência</Text>
            </View>
            {formState.hasRecurrenceEndDate && (
              <View style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <TextInput
                  style={styles.dateInputText}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  value={formState.recurrenceEndDate}
                  onChangeText={formState.handleRecurrenceEndDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            )}
          </>
        )}

        {/* Toggle de Parcelamento */}
        {!formState.isRecurring && (
          <View style={[styles.recurringRow, formState.isInstallment && styles.marginTop0]}>
            <Switch
              value={formState.isInstallment}
              onValueChange={formState.handleToggleInstallment}
              trackColor={{ false: '#D0D0D0', true: '#5BA3FF' }}
              thumbColor="#FFF"
            />
            <Text style={styles.recurringText}>Parcelado</Text>
          </View>
        )}
        {formState.isInstallment && (
          <View style={styles.installmentButtons}>
            {INSTALLMENT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.installmentButton,
                  formState.installmentCount === option.value && !formState.customInstallmentCount && styles.installmentButtonActive
                ]}
                onPress={() => {
                  formState.setInstallmentCount(option.value);
                  formState.setCustomInstallmentCount('');
                }}
              >
                <Text style={[
                  styles.installmentButtonText,
                  formState.installmentCount === option.value && !formState.customInstallmentCount && styles.installmentButtonTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={[
              styles.installmentButton,
              styles.customInstallmentButton,
              formState.customInstallmentCount && styles.installmentButtonActive
            ]}>
              <Text style={[
                styles.installmentButtonText,
                formState.customInstallmentCount && styles.installmentButtonTextActive
              ]}>
                Outro:
              </Text>
              <TextInput
                style={[
                  styles.customInstallmentInput,
                  formState.customInstallmentCount && styles.customInstallmentInputActive
                ]}
                placeholder="0"
                placeholderTextColor="#999"
                value={formState.customInstallmentCount}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  const value = parseInt(cleaned) || 0;
                  if (value <= 720) {
                    formState.setCustomInstallmentCount(cleaned);
                  }
                }}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        )}
      </View>

      {/* Seleção de instituição */}
      <View style={styles.section}>
        <Text style={styles.label}>Instituição:</Text>
        
        {/* Campo de seleção com chip */}
        <TouchableOpacity
          style={styles.institutionChipContainer}
          onPress={() => setSelectionModalVisible(true)}
          activeOpacity={0.7}
        >
          {formState.selectedInstitution ? (
            <View style={styles.institutionChipWrapper}>
              <View style={[styles.institutionChip, { borderColor: formState.selectedInstitution.cor }]}>
                {(() => {
                  const institutionLogo = getLogoByName(formState.selectedInstitution.nome);
                  return (
                    <>
                      <View style={[styles.chipIconContainer, { backgroundColor: institutionLogo ? '#FFF' : formState.selectedInstitution.cor }]}>
                        {institutionLogo ? (
                          <Image 
                            source={institutionLogo} 
                            style={styles.chipLogoImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Text style={styles.chipIconText}>{formState.selectedInstitution.icone}</Text>
                        )}
                      </View>
                      <Text style={styles.chipText}>{formState.selectedInstitution.nome}</Text>
                      <TouchableOpacity 
                        style={styles.chipRemoveButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          formState.handleSelectInstitution(null);
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

      {/* Botão Salvar */}
      <TouchableOpacity 
        style={[styles.saveButton, salvando && { opacity: 0.6 }]} 
        onPress={handleSaveTransaction}
        disabled={salvando || formState.loading}
      >
        {salvando ? (
          <>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>Salvando...</Text>
          </>
        ) : (
          <>
            <Ionicons name="save-outline" size={24} color="#FFF" />
            <Text style={styles.saveButtonText}>Salvar Transação</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Indicador de carregamento de dados */}
      {formState.loading && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#8A05BE" />
          <Text style={{ marginTop: 8, color: '#666' }}>Carregando dados...</Text>
        </View>
      )}

      {/* Modais */}
      <ModalSelecaoInstituicao
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        onSelectInstitution={handleSelectInstitution}
        onAddCustom={() => {
          setSelectionModalVisible(false);
          setCustomModalVisible(true);
        }}
        availableInstitutions={formState.instituicoes}
      />

      <ModalAdicionarInstituicao
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
        onAdd={handleAddCustomInstitution}
      />
    </ScrollView>
  );
};

export default TelaAdicionarTransacao;
