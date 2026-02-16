import { useState, useEffect } from 'react';
import { Banco, Vale, Instituicao } from '../types/carteira.types';
import { instituicaoService } from '../../../api';

/**
 * Hook customizado para gerenciar o estado da carteira
 * Gerencia bancos, vales e modais de seleção usando dados reais da API
 */
export const useGerenciarCarteira = () => {
  const [banks, setBanks] = useState<Banco[]>([]);
  const [vouchers, setVouchers] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados dos modais de bancos
  const [bankSelectionModalVisible, setBankSelectionModalVisible] = useState(false);
  const [bankCustomModalVisible, setBankCustomModalVisible] = useState(false);
  
  // Estados dos modais de vales
  const [voucherSelectionModalVisible, setVoucherSelectionModalVisible] = useState(false);
  const [voucherCustomModalVisible, setVoucherCustomModalVisible] = useState(false);

  // ID do usuário mockado (usuário 1)
  const usuarioId = 1;

  /**
   * Carrega instituições da API ao montar o componente
   */
  useEffect(() => {
    carregarInstituicoes();
  }, []);

  /**
   * Busca as instituições do usuário na API
   */
  const carregarInstituicoes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const instituicoes = await instituicaoService.listarPorUsuario(usuarioId);
      
      // Separa bancos e vales usando o campo tipoInstituicao
      const bancosList: Banco[] = [];
      const valesList: Vale[] = [];
      
      instituicoes.forEach((inst: any) => {
        // Validação: ignorar instituições sem dados obrigatórios
        if (!inst.nome || !inst.icone || !inst.cor || !inst.tipoInstituicao) {
          console.warn('Instituição com dados incompletos ignorada:', inst);
          return;
        }
        
        if (inst.tipoInstituicao === 'vale') {
          valesList.push({
            id: inst.id,
            nome: inst.nome,
            balance: 'R$ 0,00', // TODO: Calcular saldo real
            cor: inst.cor,
            icone: inst.icone,
            tipoInstituicao: 'vale',
          });
        } else {
          bancosList.push({
            id: inst.id,
            nome: inst.nome,
            balance: 'R$ 0,00', // TODO: Calcular saldo real
            expenses: 'R$ 0,00', // TODO: Calcular gastos reais
            cor: inst.cor,
            icone: inst.icone,
            tipoInstituicao: 'banco',
          });
        }
      });
      
      setBanks(bancosList);
      setVouchers(valesList);
    } catch (err: any) {
      console.error('Erro ao carregar instituições:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adiciona um banco selecionado à lista
   */
  const handleSelectBank = async (institution: Instituicao) => {
    try {
      // Verifica se o banco já existe
      const jaExiste = banks.some(bank => 
        bank.nome.toLowerCase() === institution.nome.toLowerCase()
      );
      
      if (jaExiste) {
        setError(`${institution.nome} já está adicionado`);
        return;
      }
      
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
   * Abre o modal de instituição customizada para bancos
   */
  const handleAddCustomBank = () => {
    setBankSelectionModalVisible(false);
    setBankCustomModalVisible(true);
  };

  /**
   * Adiciona um banco customizado à lista
   */
  const handleAddCustomBankComplete = async (institution: Banco) => {
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
   * Remove um banco da lista pelo ID
   */
  const handleDeleteBank = async (id: number) => {
    try {
      await instituicaoService.deletar(id);
      setBanks(banks.filter(bank => bank.id !== id));
    } catch (err) {
      console.error('Erro ao deletar banco:', err);
      setError('Erro ao deletar banco');
    }
  };

  /**
   * Adiciona um vale selecionado à lista
   */
  const handleSelectVoucher = async (institution: Instituicao) => {
    try {
      // Verifica se o vale já existe
      const jaExiste = vouchers.some(voucher => 
        voucher.nome.toLowerCase() === institution.nome.toLowerCase()
      );
      
      if (jaExiste) {
        setError(`${institution.nome} já está adicionado`);
        return;
      }
      
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
   * Abre o modal de instituição customizada para vales
   */
  const handleAddCustomVoucher = () => {
    setVoucherSelectionModalVisible(false);
    setVoucherCustomModalVisible(true);
  };

  /**
   * Adiciona um vale customizado à lista
   */
  const handleAddCustomVoucherComplete = async (institution: Vale) => {
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
   * Remove um vale da lista
   */
  const handleDeleteVoucher = async (voucher: Vale) => {
    try {
      await instituicaoService.deletar(voucher.id);
      setVouchers(vouchers.filter(v => v.id !== voucher.id));
    } catch (err) {
      console.error('Erro ao deletar vale:', err);
      setError('Erro ao deletar vale');
    }
  };

  return {
    // Estados
    banks,
    vouchers,
    loading,
    error,
    bankSelectionModalVisible,
    bankCustomModalVisible,
    voucherSelectionModalVisible,
    voucherCustomModalVisible,
    
    // Modificadores
    setBankSelectionModalVisible,
    setBankCustomModalVisible,
    setVoucherSelectionModalVisible,
    setVoucherCustomModalVisible,
    carregarInstituicoes,
    
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
