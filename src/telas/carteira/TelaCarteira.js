import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InstitutionCard, AddCard } from '../../componentes/cartoes/CartaoInstituicao';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import { useGerenciarCarteira } from './hooks/useGerenciarCarteira';
import { styles } from './styles/TelaCarteira.styles';

const WalletScreen = ({ navigation }) => {
  const carteira = useGerenciarCarteira();

  const renderIcon = (text, color) => (
    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>{text}</Text>
  );

  // Mostra loading enquanto carrega dados
  if (carteira.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8A05BE" />
        <Text style={{ marginTop: 16, color: '#666' }}>Carregando instituições...</Text>
      </View>
    );
  }

  // Mostra erro se houver
  if (carteira.error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#E31C23" />
        <Text style={{ marginTop: 16, color: '#E31C23', textAlign: 'center' }}>{carteira.error}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { marginTop: 20 }]}
          onPress={carteira.carregarInstituicoes}
        >
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

        <View style={styles.gridContainer}>
          {carteira.banks.map((bank) => (
            <InstitutionCard
              key={bank.id}
              name={bank.nome}
              balance={bank.balance}
              color={bank.cor}
              icon={renderIcon(bank.icone, bank.cor)}
              onPress={() => {}}
            />
          ))}
          <AddCard onPress={() => carteira.setBankSelectionModalVisible(true)} />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => carteira.setBankSelectionModalVisible(true)}
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

        <View style={styles.gridContainer}>
          {carteira.vouchers.map((voucher) => (
            <InstitutionCard
              key={voucher.id}
              name={voucher.nome}
              balance={voucher.balance}
              color={voucher.cor}
              icon={renderIcon(voucher.icone, voucher.cor)}
              onPress={() => {}}
            />
          ))}
          <AddCard onPress={() => carteira.setVoucherSelectionModalVisible(true)} />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => carteira.setVoucherSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <InstitutionSelectionModal
        visible={carteira.bankSelectionModalVisible}
        onClose={() => carteira.setBankSelectionModalVisible(false)}
        onSelectInstitution={carteira.handleSelectBank}
        onAddCustom={carteira.handleAddCustomBank}
        tipo="banco"
        existingInstitutions={carteira.banks}
      />

      <AddCustomInstitutionModal
        visible={carteira.bankCustomModalVisible}
        onClose={() => carteira.setBankCustomModalVisible(false)}
        onAdd={carteira.handleAddCustomBankComplete}
      />

      <InstitutionSelectionModal
        visible={carteira.voucherSelectionModalVisible}
        onClose={() => carteira.setVoucherSelectionModalVisible(false)}
        onSelectInstitution={carteira.handleSelectVoucher}
        onAddCustom={carteira.handleAddCustomVoucher}
        tipo="vale"
        existingInstitutions={carteira.vouchers}
      />

      <AddCustomInstitutionModal
        visible={carteira.voucherCustomModalVisible}
        onClose={() => carteira.setVoucherCustomModalVisible(false)}
        onAdd={carteira.handleAddCustomVoucherComplete}
      />
    </ScrollView>
  );
};

export default WalletScreen;
