import { useState } from 'react';
import { Banco, Vale, Instituicao } from '../types/carteira.types';
import { DEFAULT_BANKS, DEFAULT_VOUCHERS } from '../constants/constantesCarteira';

/**
 * Hook para gerenciar edição de bancos
 */
export const useEditarBancos = () => {
  const [banks, setBanks] = useState<Banco[]>(DEFAULT_BANKS);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Banco | null>(null);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  /**
   * Remove um banco da lista
   */
  const handleDelete = (id: number) => {
    setBanks(banks.filter(bank => bank.id !== id));
  };

  /**
   * Abre modal de edição de banco
   */
  const handleEdit = (bank: Banco) => {
    setSelectedBank(bank);
    setEditModalVisible(true);
  };

  /**
   * Adiciona instituição selecionada
   */
  const handleSelectInstitution = (institution: Instituicao) => {
    const newBank: Banco = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
      expenses: 'R$ 0,00',
    };
    setBanks([...banks, newBank]);
  };

  /**
   * Abre modal de instituição customizada
   */
  const handleAddCustomInstitution = () => {
    setSelectionModalVisible(false);
    setCustomModalVisible(true);
  };

  /**
   * Adiciona instituição customizada
   */
  const handleAddCustom = (institution: Banco) => {
    setBanks([...banks, institution]);
  };

  return {
    banks,
    editModalVisible,
    selectedBank,
    selectionModalVisible,
    customModalVisible,
    setEditModalVisible,
    setSelectionModalVisible,
    setCustomModalVisible,
    handleDelete,
    handleEdit,
    handleSelectInstitution,
    handleAddCustomInstitution,
    handleAddCustom,
  };
};

/**
 * Hook para gerenciar edição de vales
 */
export const useEditarVales = () => {
  const [vouchers, setVouchers] = useState<Vale[]>(DEFAULT_VOUCHERS);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Vale | null>(null);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  /**
   * Abre modal de edição de vale
   */
  const handleEdit = (voucher: Vale) => {
    setSelectedVoucher(voucher);
    setEditModalVisible(true);
  };

  /**
   * Remove um vale da lista
   */
  const handleDelete = (voucher: Vale) => {
    setVouchers(vouchers.filter(v => v.id !== voucher.id));
  };

  /**
   * Adiciona instituição selecionada
   */
  const handleSelectInstitution = (institution: Instituicao) => {
    const newVoucher: Vale = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
    };
    setVouchers([...vouchers, newVoucher]);
  };

  /**
   * Abre modal de instituição customizada
   */
  const handleAddCustomInstitution = () => {
    setSelectionModalVisible(false);
    setCustomModalVisible(true);
  };

  /**
   * Adiciona instituição customizada
   */
  const handleAddCustom = (institution: Vale) => {
    setVouchers([...vouchers, institution]);
  };

  return {
    vouchers,
    editModalVisible,
    selectedVoucher,
    selectionModalVisible,
    customModalVisible,
    setEditModalVisible,
    setSelectionModalVisible,
    setCustomModalVisible,
    handleEdit,
    handleDelete,
    handleSelectInstitution,
    handleAddCustomInstitution,
    handleAddCustom,
  };
};
