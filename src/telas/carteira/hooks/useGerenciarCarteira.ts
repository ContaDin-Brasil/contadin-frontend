import { useState } from 'react';
import { Banco, Vale, ViewMode, Instituicao } from '../types/carteira.types';
import { DEFAULT_BANKS, DEFAULT_VOUCHERS } from '../constants/constantesCarteira';

/**
 * Hook customizado para gerenciar o estado da carteira
 * Gerencia bancos, vales e modais de seleção
 */
export const useGerenciarCarteira = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [banks, setBanks] = useState<Banco[]>(DEFAULT_BANKS);
  const [vouchers, setVouchers] = useState<Vale[]>(DEFAULT_VOUCHERS);
  
  // Estados dos modais de bancos
  const [bankSelectionModalVisible, setBankSelectionModalVisible] = useState(false);
  const [bankCustomModalVisible, setBankCustomModalVisible] = useState(false);
  
  // Estados dos modais de vales
  const [voucherSelectionModalVisible, setVoucherSelectionModalVisible] = useState(false);
  const [voucherCustomModalVisible, setVoucherCustomModalVisible] = useState(false);

  /**
   * Adiciona um banco selecionado à lista
   */
  const handleSelectBank = (institution: Instituicao) => {
    const newBank: Banco = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
      expenses: 'R$ 0,00',
    };
    setBanks([...banks, newBank]);
  };

  /**
   * Abre o modal de instituição customizada para bancos
   */
  const handleAddCustomBank = () => {
    setBankSelectionModalVisible(false);
    setBankCustomModalVisible(true);
  };

  /**
   * Adiciona um banco customizado à lista
   */
  const handleAddCustomBankComplete = (institution: Banco) => {
    setBanks([...banks, institution]);
  };

  /**
   * Remove um banco da lista pelo ID
   */
  const handleDeleteBank = (id: number) => {
    setBanks(banks.filter(bank => bank.id !== id));
  };

  /**
   * Adiciona um vale selecionado à lista
   */
  const handleSelectVoucher = (institution: Instituicao) => {
    const newVoucher: Vale = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
    };
    setVouchers([...vouchers, newVoucher]);
  };

  /**
   * Abre o modal de instituição customizada para vales
   */
  const handleAddCustomVoucher = () => {
    setVoucherSelectionModalVisible(false);
    setVoucherCustomModalVisible(true);
  };

  /**
   * Adiciona um vale customizado à lista
   */
  const handleAddCustomVoucherComplete = (institution: Vale) => {
    setVouchers([...vouchers, institution]);
  };

  /**
   * Remove um vale da lista
   */
  const handleDeleteVoucher = (voucher: Vale) => {
    setVouchers(vouchers.filter(v => v.id !== voucher.id));
  };

  return {
    // Estados
    viewMode,
    banks,
    vouchers,
    bankSelectionModalVisible,
    bankCustomModalVisible,
    voucherSelectionModalVisible,
    voucherCustomModalVisible,
    
    // Modificadores
    setViewMode,
    setBankSelectionModalVisible,
    setBankCustomModalVisible,
    setVoucherSelectionModalVisible,
    setVoucherCustomModalVisible,
    
    // Ações de Bancos
    handleSelectBank,
    handleAddCustomBank,
    handleAddCustomBankComplete,
    handleDeleteBank,
    
    // Ações de Vales
    handleSelectVoucher,
    handleAddCustomVoucher,
    handleAddCustomVoucherComplete,
    handleDeleteVoucher,
  };
};
