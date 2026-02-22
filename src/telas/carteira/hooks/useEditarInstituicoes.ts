import { useState, useEffect } from 'react';
import { Banco, Vale, Instituicao } from '../types/carteira.types';
import { instituicaoService } from '../../../api';
import { useCache } from '../../../contexts/CacheContext';
import { getInstituicoesPadrao } from '../constants/instituicoesPadrao';

/**
 * Hook para gerenciar edição de bancos (COM CACHE)
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
  const { getCache, setCache, invalidateCacheByPattern } = useCache();

  useEffect(() => {
    carregarBancos();
  }, []);

  /**
   * Carrega bancos da API (com cache)
   */
  const carregarBancos = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const cacheKey = `instituicoes:bancos:user:${usuarioId}`;
      
      // Tenta buscar do cache primeiro (a menos que force refresh)
      if (!forceRefresh) {
        const cached = await getCache<Banco[]>(cacheKey);
        if (cached) {
          setBanks(cached);
          setLoading(false);
          return;
        }
      }
      
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
      
      // Salva no cache
      await setCache(cacheKey, bancosList);
      
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
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarBancos(true);
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
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'banco',
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarBancos(true);
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
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: institution.tipoInstituicao,
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarBancos(true);
    } catch (err) {
      console.error('Erro ao adicionar banco customizado:', err);
      setError('Erro ao adicionar banco');
    }
  };

  /**
   * Retorna instituições padrões que o usuário ainda não adicionou
   */
  const getAvailableBanks = () => {
    const bancosUsuario = banks.map(b => b.nome.toLowerCase());
    const bancosPadrao = getInstituicoesPadrao('banco');
    return bancosPadrao.filter(banco => !bancosUsuario.includes(banco.nome.toLowerCase()));
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
        tipoInstituicao: updatedBank.tipoInstituicao,
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarBancos(true);
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
    availableBanks: getAvailableBanks(),
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
 * Hook para gerenciar edição de vales (COM CACHE)
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
  const { getCache, setCache, invalidateCacheByPattern } = useCache();

  useEffect(() => {
    carregarVales();
  }, []);

  /**
   * Carrega vales da API (com cache)
   */
  const carregarVales = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const cacheKey = `instituicoes:vales:user:${usuarioId}`;
      
      // Tenta buscar do cache primeiro (a menos que force refresh)
      if (!forceRefresh) {
        const cached = await getCache<Vale[]>(cacheKey);
        if (cached) {
          setVouchers(cached);
          setLoading(false);
          return;
        }
      }
      
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
      
      // Salva no cache
      await setCache(cacheKey, valesList);
      
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
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarVales(true);
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
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: 'vale',
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarVales(true);
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
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        tipoInstituicao: institution.tipoInstituicao,
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarVales(true);
    } catch (err) {
      console.error('Erro ao adicionar vale customizado:', err);
      setError('Erro ao adicionar vale');
    }
  };

  /**
   * Retorna instituições padrões que o usuário ainda não adicionou
   */
  const getAvailableVouchers = () => {
    const valesUsuario = vouchers.map(v => v.nome.toLowerCase());
    const valesPadrao = getInstituicoesPadrao('vale');
    return valesPadrao.filter(vale => !valesUsuario.includes(vale.nome.toLowerCase()));
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
        tipoInstituicao: updatedVoucher.tipoInstituicao,
        fk_usuario: usuarioId,
      });
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarVales(true);
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
    availableVouchers: getAvailableVouchers(),
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
