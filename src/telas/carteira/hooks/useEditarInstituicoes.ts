import { useState, useEffect } from 'react';
import { Banco, Vale, Instituicao } from '../types/carteira.types';
import { instituicaoService } from '../../../api';

/**
 * Hook para gerenciar edição de bancos
 */
export const useEditarBancos = () => {
  const [banks, setBanks] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Banco | null>(null);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  const usuarioId = 1;

  useEffect(() => {
    carregarBancos();
  }, []);

  /**
   * Carrega bancos da API
   */
  const carregarBancos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const instituicoes = await instituicaoService.listarPorUsuario(usuarioId);
      
      // Filtra apenas bancos usando tipoInstituicao
      const bancosList: Banco[] = instituicoes
        .filter((inst: any) => inst.tipoInstituicao === 'banco')
        .map((inst: any) => ({
          id: inst.id,
          nome: inst.nome,
          balance: 'R$ 0,00',
          expenses: 'R$ 0,00',
          cor: inst.cor,
          icone: inst.icone,
          tipoInstituicao: 'banco',
        }));
      
      setBanks(bancosList);
    } catch (err: any) {
      console.error('Erro ao carregar bancos:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove um banco da lista
   */
  const handleDelete = async (id: number) => {
    try {
      await instituicaoService.deletar(id);
      setBanks(banks.filter(bank => bank.id !== id));
    } catch (err) {
      console.error('Erro ao deletar banco:', err);
      setError('Erro ao deletar banco');
    }
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
  const handleSelectInstitution = async (institution: Instituicao) => {
    try {
      const novaInstituicao = await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'banco',
        fk_usuario: usuarioId,
      });
      
      const newBank: Banco = {
        id: novaInstituicao.id,
        nome: novaInstituicao.nome,
        balance: 'R$ 0,00',
        expenses: 'R$ 0,00',
        cor: novaInstituicao.cor,
        icone: novaInstituicao.icone,
        tipoInstituicao: 'banco',
      };
      setBanks([...banks, newBank]);
    } catch (err) {
      console.error('Erro ao adicionar banco:', err);
      setError('Erro ao adicionar banco');
    }
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
  const handleAddCustom = async (institution: Banco) => {
    try {
      const novaInstituicao = await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'banco',
        fk_usuario: usuarioId,
      });
      
      const newBank: Banco = {
        ...institution,
        id: novaInstituicao.id,
      };
      setBanks([...banks, newBank]);
    } catch (err) {
      console.error('Erro ao adicionar banco customizado:', err);
      setError('Erro ao adicionar banco');
    }
  };

  /**
   * Atualiza dados do banco
   */
  const handleUpdate = async (updatedBank: Banco) => {
    try {
      await instituicaoService.atualizar(updatedBank.id, {
        nome: updatedBank.nome,
        icone: updatedBank.icone,
        cor: updatedBank.cor,
        tipoInstituicao: 'banco',
        fk_usuario: usuarioId,
      });
      
      setBanks(banks.map(bank => 
        bank.id === updatedBank.id ? { ...bank, ...updatedBank } : bank
      ));
      setEditModalVisible(false);
    } catch (err) {
      console.error('Erro ao atualizar banco:', err);
      setError('Erro ao atualizar banco');
    }
  };

  return {
    banks,
    loading,
    error,
    editModalVisible,
    selectedBank,
    selectionModalVisible,
    customModalVisible,
    setEditModalVisible,
    setSelectionModalVisible,
    setCustomModalVisible,
    handleDelete,
    handleEdit,
    handleUpdate,
    handleSelectInstitution,
    handleAddCustomInstitution,
    handleAddCustom,
    carregarBancos,
  };
};

/**
 * Hook para gerenciar edição de vales
 */
export const useEditarVales = () => {
  const [vouchers, setVouchers] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Vale | null>(null);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  const usuarioId = 1;

  useEffect(() => {
    carregarVales();
  }, []);

  /**
   * Carrega vales da API
   */
  const carregarVales = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const instituicoes = await instituicaoService.listarPorUsuario(usuarioId);
      
      // Filtra apenas vales usando tipoInstituicao
      const valesList: Vale[] = instituicoes
        .filter((inst: any) => inst.tipoInstituicao === 'vale')
        .map((inst: any) => ({
          id: inst.id,
          nome: inst.nome,
          balance: 'R$ 0,00',
          cor: inst.cor,
          icone: inst.icone,
          tipoInstituicao: 'vale',
        }));
      
      setVouchers(valesList);
    } catch (err: any) {
      console.error('Erro ao carregar vales:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

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
  const handleDelete = async (voucher: Vale) => {
    try {
      await instituicaoService.deletar(voucher.id);
      setVouchers(vouchers.filter(v => v.id !== voucher.id));
    } catch (err) {
      console.error('Erro ao deletar vale:', err);
      setError('Erro ao deletar vale');
    }
  };

  /**
   * Adiciona instituição selecionada
   */
  const handleSelectInstitution = async (institution: Instituicao) => {
    try {
      const novaInstituicao = await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'vale',
        fk_usuario: usuarioId,
      });
      
      const newVoucher: Vale = {
        id: novaInstituicao.id,
        nome: novaInstituicao.nome,
        balance: 'R$ 0,00',
        cor: novaInstituicao.cor,
        icone: novaInstituicao.icone,
        tipoInstituicao: 'vale',
      };
      setVouchers([...vouchers, newVoucher]);
    } catch (err) {
      console.error('Erro ao adicionar vale:', err);
      setError('Erro ao adicionar vale');
    }
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
  const handleAddCustom = async (institution: Vale) => {
    try {
      const novaInstituicao = await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'vale',
        fk_usuario: usuarioId,
      });
      
      const newVoucher: Vale = {
        ...institution,
        id: novaInstituicao.id,
      };
      setVouchers([...vouchers, newVoucher]);
    } catch (err) {
      console.error('Erro ao adicionar vale customizado:', err);
      setError('Erro ao adicionar vale');
    }
  };

  /**
   * Atualiza dados do vale
   */
  const handleUpdate = async (updatedVoucher: Vale) => {
    try {
      await instituicaoService.atualizar(updatedVoucher.id, {
        nome: updatedVoucher.nome,
        icone: updatedVoucher.icone,
        cor: updatedVoucher.cor,
        tipoInstituicao: 'vale',
        fk_usuario: usuarioId,
      });
      
      setVouchers(vouchers.map(voucher => 
        voucher.id === updatedVoucher.id ? { ...voucher, ...updatedVoucher } : voucher
      ));
      setEditModalVisible(false);
    } catch (err) {
      console.error('Erro ao atualizar vale:', err);
      setError('Erro ao atualizar vale');
    }
  };

  return {
    vouchers,
    loading,
    error,
    editModalVisible,
    selectedVoucher,
    selectionModalVisible,
    customModalVisible,
    setEditModalVisible,
    setSelectionModalVisible,
    setCustomModalVisible,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleSelectInstitution,
    handleAddCustomInstitution,
    handleAddCustom,
    carregarVales,
  };
};
