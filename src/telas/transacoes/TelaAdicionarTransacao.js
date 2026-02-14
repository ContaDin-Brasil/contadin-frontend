import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalSelecaoInstituicao from '../componentes/modais/ModalSelecaoInstituicao';
import ModalAdicionarInstituicao from '../componentes/modais/ModalAdicionarInstituicao';

const TelaAdicionarTransacao = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('income'); // 'expense' ou 'income'
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('salary');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [institutionType, setInstitutionType] = useState('banks'); // 'vouchers' ou 'banks'
  const [selectedInstitutions, setSelectedInstitutions] = useState([
    { id: 1, name: 'Santander', color: '#E31C23', icon: 'S' },
    { id: 2, name: 'Nubank', color: '#820AD1', icon: 'Nu' },
    { id: 3, name: 'Itaú', color: '#FF6600', icon: 'I' },
    { id: 4, name: 'Flash', color: '#FF1493', icon: 'F' },
  ]);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  const categories = [
    { id: 'food', name: 'Alimentação', icon: 'restaurant' },
    { id: 'leisure', name: 'Lazer', icon: 'happy' },
    { id: 'salary', name: 'Salário', icon: 'cash' },
  ];

  const frequencies = [
    { id: 'annual', name: 'Anual' },
    { id: 'monthly', name: 'Mensal' },
    { id: 'weekly', name: 'Semanal' },
    { id: 'daily', name: 'Diária' },
  ];

  const handleSelectInstitution = (institution) => {
    const exists = selectedInstitutions.find(i => i.id === institution.id);
    if (!exists) {
      setSelectedInstitutions([...selectedInstitutions, institution]);
    }
    setSelectionModalVisible(false);
  };

  const handleAddCustomInstitution = (institution) => {
    setSelectedInstitutions([...selectedInstitutions, institution]);
    setCustomModalVisible(false);
  };

  const handleSaveTransaction = () => {
    // Implementar lógica de salvar transação
    console.log('Transação salva:', {
      description,
      transactionType,
      selectedCategory,
      isRecurring,
      frequency: isRecurring ? frequency : null,
      institutions: selectedInstitutions,
      institutionType
    });
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

      {/* Descrição da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Descrição da transação:</Text>
        <TextInput
          style={styles.input}
          placeholder="Salário Avanade"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Tipo da transação */}
      <View style={styles.section}>
        <Text style={styles.label}>Tipo da transação:</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'expense' && styles.typeButtonActive
            ]}
            onPress={() => setTransactionType('expense')}
          >
            <Text style={[
              styles.typeButtonText,
              transactionType === 'expense' && styles.typeButtonTextActive
            ]}>
              Gasto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButtonIncome,
              transactionType === 'income' && styles.typeButtonActive
            ]}
            onPress={() => setTransactionType('income')}
          >
            <Text style={[
              styles.typeButtonText,
              transactionType === 'income' && styles.typeButtonTextActive
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
            value={categorySearch}
            onChangeText={setCategorySearch}
          />
        </View>
        <View style={styles.categoryButtons}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? '#FFF' : '#333'}
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recorrência */}
      <View style={styles.section}>
        <View style={styles.recurringRow}>
          <Switch
            value={isRecurring}
            onValueChange={setIsRecurring}
            trackColor={{ false: '#D0D0D0', true: '#5BA3FF' }}
            thumbColor="#FFF"
          />
          <Text style={styles.recurringText}>Recorrência</Text>
        </View>
        {isRecurring && (
          <View style={styles.frequencyButtons}>
            {frequencies.map(freq => (
              <TouchableOpacity
                key={freq.id}
                style={[
                  styles.frequencyButton,
                  frequency === freq.id && styles.frequencyButtonActive
                ]}
                onPress={() => setFrequency(freq.id)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  frequency === freq.id && styles.frequencyButtonTextActive
                ]}>
                  {freq.name}
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
              institutionType === 'vouchers' && styles.institutionTypeButtonActive
            ]}
            onPress={() => setInstitutionType('vouchers')}
          >
            <Text style={[
              styles.institutionTypeButtonText,
              institutionType === 'vouchers' && styles.institutionTypeButtonTextActive
            ]}>
              Vales
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.institutionTypeButton,
              institutionType === 'banks' && styles.institutionTypeButtonActive
            ]}
            onPress={() => setInstitutionType('banks')}
          >
            <Text style={[
              styles.institutionTypeButtonText,
              institutionType === 'banks' && styles.institutionTypeButtonTextActive
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
            {selectedInstitutions.slice(0, 4).map(institution => (
              <View
                key={institution.id}
                style={[styles.institutionIcon, { backgroundColor: institution.color }]}
              >
                <Text style={styles.institutionIconText}>{institution.icon}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  typeButtonIncome: {
    backgroundColor: '#FFF',
  },
  typeButtonActive: {
    backgroundColor: '#5BA3FF',
    borderColor: '#5BA3FF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#5BA3FF',
    borderColor: '#5BA3FF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFF',
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  recurringText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  frequencyButtonActive: {
    backgroundColor: '#5BA3FF',
    borderColor: '#5BA3FF',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  frequencyButtonTextActive: {
    color: '#FFF',
  },
  institutionTypeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  institutionTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  institutionTypeButtonActive: {
    backgroundColor: '#5BA3FF',
    borderColor: '#5BA3FF',
  },
  institutionTypeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  institutionTypeButtonTextActive: {
    color: '#FFF',
  },
  institutionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  institutionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  institutionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  institutionIconText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5BA3FF',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 16,
    borderRadius: 15,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TelaAdicionarTransacao;
