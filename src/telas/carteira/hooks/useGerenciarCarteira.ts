import { useState, useEffect } from 'react';
import { Banco, Vale, Instituicao } from '../types/carteira.types';
import { instituicaoService } from '../../../api';
import transacaoService from '../../../api/services/transacaoService';
import { useCache } from '../../../contexts/CacheContext';
import { getInstituicoesPadrao } from '../constants/instituicoesPadrao';

/**
 * Hook customizado para gerenciar o estado da carteira
 * Gerencia bancos, vales e modais de seleção usando dados reais da API
 * COM CACHE: Evita requisições desnecessárias
 */
export const useGerenciarCarteira = () => {
  const [banks, setBanks] = useState<Banco[]>([]);
  const [vouchers, setVouchers] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getCache, setCache, invalidateCacheByPattern } = useCache();
  
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
   * Busca as instituições do usuário na API (com cache)
   */
  const carregarInstituicoes = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const cacheKey = `instituicoes:user:${usuarioId}`;
      
      // Tenta buscar do cache primeiro (a menos que force refresh)
      if (!forceRefresh) {
        const cached = await getCache<any[]>(cacheKey);
        if (cached) {
          // Cache só guarda instituições; busca transações sempre (sem cache)
          const transacoes = await transacaoService.listar();
          processarInstituicoes(cached, transacoes);
          setLoading(false);
          return;
        }
      }
      
      // Se não tem cache ou forçou refresh, busca da API
      const [instituicoes, transacoes] = await Promise.all([
        instituicaoService.listarPorUsuario(usuarioId),
        transacaoService.listar(),
      ]);

      // Salva no cache (válido por 5 minutos)
      await setCache(cacheKey, instituicoes);

      processarInstituicoes(instituicoes, transacoes);
    } catch (err) {
      console.error('Erro ao carregar instituições:', err);
      setError('Erro ao carregar instituições');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formata valor numérico para moeda brasileira
   */
  const formatarSaldo = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  /**
   * Calcula saldo de uma instituição a partir das transações
   * Saldo = soma de RECEITAs - soma de GASTOs
   */
  const calcularSaldo = (instituicaoId: number, transacoes: any[]): number => {
    return transacoes
      .filter(t => t.fk_instituicao === instituicaoId)
      .reduce((acc, t) => t.tipo === 'RECEITA' ? acc + t.valor : acc - t.valor, 0);
  };

  /**
   * Processa a lista de instituições e separa em bancos e vales
   */
  const processarInstituicoes = (instituicoes: any[], transacoes: any[] = []) => {
    const bancosList: Banco[] = [];
    const valesList: Vale[] = [];
    
    instituicoes.forEach((inst: any) => {
      // Validação: ignorar instituições sem dados obrigatórios
      if (!inst.nome || !inst.icone || !inst.cor || !inst.tipoInstituicao) {
        console.warn('Instituição com dados incompletos ignorada:', inst);
        return;
      }

      const saldo = calcularSaldo(inst.id, transacoes);
      const gastos = transacoes
        .filter(t => t.fk_instituicao === inst.id && t.tipo === 'GASTO')
        .reduce((acc, t) => acc + t.valor, 0);

      if (inst.tipoInstituicao === 'vale') {
        valesList.push({
          id: inst.id,
          nome: inst.nome,
          balance: formatarSaldo(saldo),
          cor: inst.cor,
          icone: inst.icone,
          tipoInstituicao: 'vale',
        });
      } else {
        bancosList.push({
          id: inst.id,
          nome: inst.nome,
          balance: formatarSaldo(saldo),
          expenses: formatarSaldo(gastos),
          cor: inst.cor,
          icone: inst.icone,
          tipoInstituicao: 'banco',
        });
      }
    });
    
    setBanks(bancosList);
    setVouchers(valesList);
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
      
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'banco',
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarInstituicoes(true); // Force refresh
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
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: institution.tipoInstituicao,
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarInstituicoes(true);
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
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarInstituicoes(true);
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
      
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'vale',
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarInstituicoes(true);
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
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: institution.tipoInstituicao,
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarInstituicoes(true);
    } catch (err) {
      console.error('Erro ao adicionar vale customizado:', err);
      setError('Erro ao adicionar vale');
    }
  };

  /**
   * Retorna bancos padrões que o usuário ainda não adicionou
   */
  const getAvailableBanks = () => {
    const bancosUsuario = banks.map(b => b.nome.toLowerCase());
    const bancosPadrao = getInstituicoesPadrao('banco');
    return bancosPadrao.filter(banco => !bancosUsuario.includes(banco.nome.toLowerCase()));
  };

  /**
   * Retorna vales padrões que o usuário ainda não adicionou
   */
  const getAvailableVouchers = () => {
    const valesUsuario = vouchers.map(v => v.nome.toLowerCase());
    const valesPadrao = getInstituicoesPadrao('vale');
    return valesPadrao.filter(vale => !valesUsuario.includes(vale.nome.toLowerCase()));
  };

  /**
   * Remove um vale da lista
   */
  const handleDeleteVoucher = async (voucher: Vale) => {
    try {
      await instituicaoService.deletar(voucher.id);
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarInstituicoes(true);
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
    availableBanks: getAvailableBanks(),
    availableVouchers: getAvailableVouchers(),
    
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
