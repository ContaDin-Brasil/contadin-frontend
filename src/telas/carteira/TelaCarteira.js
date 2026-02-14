import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InstitutionCard, AddCard } from '../../componentes/cartoes/CartaoInstituicao';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';

const WalletScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [bankSelectionModalVisible, setBankSelectionModalVisible] = useState(false);
  const [bankCustomModalVisible, setBankCustomModalVisible] = useState(false);
  const [voucherSelectionModalVisible, setVoucherSelectionModalVisible] = useState(false);
  const [voucherCustomModalVisible, setVoucherCustomModalVisible] = useState(false);
  
  // Dados de exemplo
  const [banks, setBanks] = useState([
    { id: 1, name: 'Santander', balance: 'R$ 0,00', color: '#E31C23', icon: 'S' },
    { id: 2, name: 'Nubank', balance: 'R$ 0,00', color: '#820AD1', icon: 'Nu' },
    { id: 3, name: 'Itaú', balance: 'R$ 0,00', color: '#FF6600', icon: 'I' },
    { id: 4, name: 'Bradesco', balance: 'R$ 0,00', color: '#CC092F', icon: 'B' },
    { id: 5, name: 'C6Bank', balance: 'R$ 0,00', color: '#000', icon: 'C6' },
  ]);

  const [vouchers, setVouchers] = useState([
    { id: 1, name: 'Flash', balance: 'R$ 0,00', color: '#FF1493', icon: 'F' },
    { id: 2, name: 'Alelo', balance: 'R$ 0,00', color: '#7FBA00', icon: 'A' },
  ]);

  const renderIcon = (text, color) => (
    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>{text}</Text>
  );

  const handleSelectBank = (institution) => {
    const newBank = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
    };
    setBanks([...banks, newBank]);
  };

  const handleAddCustomBank = () => {
    setBankSelectionModalVisible(false);
    setBankCustomModalVisible(true);
  };

  const handleAddCustomBankComplete = (institution) => {
    setBanks([...banks, institution]);
  };

  const handleSelectVoucher = (institution) => {
    const newVoucher = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
    };
    setVouchers([...vouchers, newVoucher]);
  };

  const handleAddCustomVoucher = () => {
    setVoucherSelectionModalVisible(false);
    setVoucherCustomModalVisible(true);
  };

  const handleAddCustomVoucherComplete = (institution) => {
    setVouchers([...vouchers, institution]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Suas Instituições</Text>

      {/* Seção Contas Bancárias */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#000" />
            <View style={styles.sectionTitleText}>
              <Text style={styles.sectionTitle}>Contas Bancárias</Text>
              <Text style={styles.sectionSubtitle}>Valor das faturas: R$ 0,00</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditBanks')}>
            <View style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
          {banks.map((bank) => (
            <InstitutionCard
              key={bank.id}
              name={bank.name}
              balance={bank.balance}
              color={bank.color}
              icon={renderIcon(bank.icon, bank.color)}
              variant={viewMode}
              onPress={() => {}}
            />
          ))}
          {viewMode === 'grid' && <AddCard onPress={() => setBankSelectionModalVisible(true)} variant="grid" />}
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setBankSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Seção Vales */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#000" />
            <View style={styles.sectionTitleText}>
              <Text style={styles.sectionTitle}>Vales</Text>
              <Text style={styles.sectionSubtitle}>Valor das faturas: R$ 0,00</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditVouchers')}>
            <View style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
          {vouchers.map((voucher) => (
            <InstitutionCard
              key={voucher.id}
              name={voucher.name}
              balance={voucher.balance}
              color={voucher.color}
              icon={renderIcon(voucher.icon, voucher.color)}
              variant={viewMode}
              onPress={() => {}}
            />
          ))}
          {viewMode === 'grid' && <AddCard onPress={() => setVoucherSelectionModalVisible(true)} variant="grid" />}
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setVoucherSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <InstitutionSelectionModal
        visible={bankSelectionModalVisible}
        onClose={() => setBankSelectionModalVisible(false)}
        onSelectInstitution={handleSelectBank}
        onAddCustom={handleAddCustomBank}
      />

      <AddCustomInstitutionModal
        visible={bankCustomModalVisible}
        onClose={() => setBankCustomModalVisible(false)}
        onAdd={handleAddCustomBankComplete}
      />

      <InstitutionSelectionModal
        visible={voucherSelectionModalVisible}
        onClose={() => setVoucherSelectionModalVisible(false)}
        onSelectInstitution={handleSelectVoucher}
        onAddCustom={handleAddCustomVoucher}
      />

      <AddCustomInstitutionModal
        visible={voucherCustomModalVisible}
        onClose={() => setVoucherCustomModalVisible(false)}
        onAdd={handleAddCustomVoucherComplete}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 8,
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
  editButton: {
    backgroundColor: '#4A9EFF',
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listContainer: {
    marginBottom: 12,
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

export default WalletScreen;
