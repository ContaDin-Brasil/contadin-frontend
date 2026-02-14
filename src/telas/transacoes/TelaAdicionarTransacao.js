import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalSelecaoInstituicao from '../../componentes/modais/ModalSelecaoInstituicao';
import ModalAdicionarInstituicao from '../../componentes/modais/ModalAdicionarInstituicao';
import { useFormularioTransacao } from './hooks/useFormularioTransacao';
import { useProcessamentoIA } from './hooks/useProcessamentoIA';
import { CATEGORIES, FREQUENCIES } from './constants/constantesTransacao';
import { getCategoryIcon } from './utils/utilitariosTransacao';
import { styles } from './styles/TelaAdicionarTransacao.styles';

const TelaAdicionarTransacao = ({ navigation }) => {
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

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

  const handleSaveTransaction = () => {
    const data = formState.getFormData();
    console.log('Transação salva:', data);
    navigation.goBack();
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
          {CATEGORIES.map(category => (
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

      {/* Recorrência */}
      <View style={styles.section}>
        <View style={styles.recurringRow}>
          <Switch
            value={formState.isRecurring}
            onValueChange={formState.setIsRecurring}
            trackColor={{ false: '#D0D0D0', true: '#5BA3FF' }}
            thumbColor="#FFF"
          />
          <Text style={styles.recurringText}>Recorrência</Text>
        </View>
        {formState.isRecurring && (
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
        )}
      </View>

      {/* Seleção de instituição */}
      <View style={styles.section}>
        <Text style={styles.label}>Selecione a instituição:</Text>
        <View style={styles.institutionTypeButtons}>
          <TouchableOpacity
            style={[
              styles.institutionTypeButton,
              formState.institutionType === 'vouchers' && styles.institutionTypeButtonActive
            ]}
            onPress={() => formState.setInstitutionType('vouchers')}
          >
            <Text style={[
              styles.institutionTypeButtonText,
              formState.institutionType === 'vouchers' && styles.institutionTypeButtonTextActive
            ]}>
              Vales
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.institutionTypeButton,
              formState.institutionType === 'banks' && styles.institutionTypeButtonActive
            ]}
            onPress={() => formState.setInstitutionType('banks')}
          >
            <Text style={[
              styles.institutionTypeButtonText,
              formState.institutionType === 'banks' && styles.institutionTypeButtonTextActive
            ]}>
              Bancos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instituições selecionadas */}
        <TouchableOpacity
          style={styles.institutionSelector}
          onPress={() => setSelectionModalVisible(true)}
        >
          <View style={styles.institutionIcons}>
            {formState.selectedInstitutions.slice(0, 4).map(institution => (
              <View
                key={institution.id}
                style={[styles.institutionIcon, { backgroundColor: institution.cor }]}
              >
                <Text style={styles.institutionIconText}>{institution.icone}</Text>
              </View>
            ))}
          </View>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTransaction}>
        <Ionicons name="save-outline" size={24} color="#FFF" />
        <Text style={styles.saveButtonText}>Salvar Transação</Text>
      </TouchableOpacity>

      {/* Modais */}
      <ModalSelecaoInstituicao
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        onSelectInstitution={handleSelectInstitution}
        onAddCustom={() => {
          setSelectionModalVisible(false);
          setCustomModalVisible(true);
        }}
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
