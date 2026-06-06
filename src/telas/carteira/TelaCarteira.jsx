import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import { InstitutionCard, AddCard } from '../../componentes/cartoes/CartaoInstituicao';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import { useGerenciarCarteira } from './hooks/useGerenciarCarteira';
import { getStyles } from './styles/TelaCarteira.styles';
import { getColorsByTheme } from '../../styles/colors';
import { useTheme } from '../../contexts/ThemeContext';

const WalletScreen = ({ navigation }) => {
  const carteira = useGerenciarCarteira();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);

  // Recarrega dados quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      carteira.carregarInstituicoes(true); // forceRefresh=true para sempre buscar dados frescos
    }, [])
  );

  const renderIcon = (text, color) => (
    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{text}</Text>
  );

  // Mostra loading enquanto carrega dados
  if (carteira.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: COLORS.textSecondary }}>Carregando instituições...</Text>
      </View>
    );
  }

  // Mostra erro se houver
  if (carteira.error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={{ marginTop: 16, color: COLORS.error, textAlign: 'center' }}>{carteira.error}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { marginTop: 20 }]}
          onPress={carteira.carregarInstituicoes}
        >
          <Ionicons name="refresh" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina>Suas Instituições</TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>

      {/* Seção Contas Bancárias */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.sectionTitleText}>
              <Text style={styles.sectionTitle}>Contas Bancárias</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditarBanco')}>
            <View style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={COLORS.white} />
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
              onPress={() => {
                navigation.navigate('Transacoes', {
                  screen: 'Transacao',
                  params: {
                    instituicao: {
                      id: bank.id,
                      nome: bank.nome,
                      cor: bank.cor,
                      icone: bank.icone,
                      tipo: 'banco',
                      balance: bank.balance,
                      expenses: bank.expenses,
                    }
                  }
                });
              }}
            />
          ))}
          <AddCard onPress={() => carteira.setBankSelectionModalVisible(true)} />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => carteira.setBankSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Seção Vales */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.sectionTitleText}>
              <Text style={styles.sectionTitle}>Vales</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditarVouchers')}>
            <View style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={COLORS.white} />
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
              onPress={() => {
                navigation.navigate('Transacoes', {
                  screen: 'Transacao',
                  params: {
                    instituicao: {
                      id: voucher.id,
                      nome: voucher.nome,
                      cor: voucher.cor,
                      icone: voucher.icone,
                      tipo: 'vale',
                      balance: voucher.balance,
                    }
                  }
                });
              }}
            />
          ))}
          <AddCard onPress={() => carteira.setVoucherSelectionModalVisible(true)} />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => carteira.setVoucherSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      <InstitutionSelectionModal
        visible={carteira.bankSelectionModalVisible}
        onClose={() => carteira.setBankSelectionModalVisible(false)}
        onSelectInstitution={carteira.handleSelectBank}
        onAddCustom={carteira.handleAddCustomBank}
        availableInstitutions={carteira.availableBanks}
      />

      <AddCustomInstitutionModal
        visible={carteira.bankCustomModalVisible}
        onClose={() => carteira.setBankCustomModalVisible(false)}
        onAdd={carteira.handleAddCustomBankComplete}
        tipoInicial="banco"
      />

      <InstitutionSelectionModal
        visible={carteira.voucherSelectionModalVisible}
        onClose={() => carteira.setVoucherSelectionModalVisible(false)}
        onSelectInstitution={carteira.handleSelectVoucher}
        onAddCustom={carteira.handleAddCustomVoucher}
        availableInstitutions={carteira.availableVouchers}
      />

      <AddCustomInstitutionModal
        visible={carteira.voucherCustomModalVisible}
        onClose={() => carteira.setVoucherCustomModalVisible(false)}
        onAdd={carteira.handleAddCustomVoucherComplete}
        tipoInicial="vale"
      />
    </SafeAreaView>
  );
};

export default WalletScreen;