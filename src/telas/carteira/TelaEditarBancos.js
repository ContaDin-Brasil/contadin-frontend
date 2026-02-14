import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../../componentes/modais/ModalBase';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';

const EditBanksScreen = ({ navigation }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  const [banks, setBanks] = useState([
    { id: 1, name: 'Santander', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#E31C23', icon: 'S' },
    { id: 2, name: 'Nubank', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#820AD1', icon: 'Nu' },
    { id: 3, name: 'Itaú', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#FF6600', icon: 'I' },
    { id: 4, name: 'Bradesco', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#CC092F', icon: 'B' },
    { id: 5, name: 'Santander', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#E31C23', icon: 'S' },
    { id: 6, name: 'Nubank', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#820AD1', icon: 'Nu' },
    { id: 7, name: 'Itaú', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#FF6600', icon: 'I' },
    { id: 8, name: 'Bradesco', balance: 'R$ 0,00', expenses: 'R$ 0,00', color: '#CC092F', icon: 'B' },
  ]);

  const handleDelete = (id) => {
    setBanks(banks.filter(bank => bank.id !== id));
  };

  const handleEdit = (bank) => {
    setSelectedBank(bank);
    setEditModalVisible(true);
  };

  const handleSelectInstitution = (institution) => {
    const newBank = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
      expenses: 'R$ 0,00',
    };
    setBanks([...banks, newBank]);
  };

  const handleAddCustomInstitution = () => {
    setSelectionModalVisible(false);
    setCustomModalVisible(true);
  };

  const handleAddCustom = (institution) => {
    setBanks([...banks, institution]);
  };

  const renderIcon = (text, color) => (
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Text style={styles.iconText}>{text}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Bancos</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#000" />
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionTitle}>Contas Bancárias</Text>
            <Text style={styles.sectionSubtitle}>Valor das faturas: R$ 0,00</Text>
          </View>
        </View>

        <View style={styles.banksList}>
          {banks.map((bank) => (
            <View key={bank.id} style={styles.bankItem}>
              <View style={styles.bankInfo}>
                {renderIcon(bank.icon, bank.color)}
                <View style={styles.bankDetails}>
                  <Text style={styles.bankName}>{bank.name}</Text>
                  <Text style={styles.bankBalance}>Saldo Atual: {bank.balance}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(bank.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <InstitutionSelectionModal
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        onSelectInstitution={handleSelectInstitution}
        onAddCustom={handleAddCustomInstitution}
      />

      <AddCustomInstitutionModal
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
        onAdd={handleAddCustom}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitleText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  banksList: {
    gap: 10,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  bankBalance: {
    fontSize: 13,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  addButtonContainer: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#4A9EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditBanksScreen;
