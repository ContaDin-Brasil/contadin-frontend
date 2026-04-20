import { useState, useEffect } from 'react';
import { Banco, Vale, Instituicao } from '../types/carteira.types';
import { instituicaoService } from '../../../api';
import type { InstituicaoApi } from '../../../api/types';
import { useCache } from '../../../contexts/CacheContext';
import { useAuth } from '../../../contexts/AuthContext';
import { getInstituicoesPadrao } from '../constants/instituicoesPadrao';
import {
  extrairUsuarioId,
  idValido,
  obterUsuarioIdOuErro,
  normalizarTipoInstituicaoDaEntidade,
} from '../../../utils/normalizacao';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

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

  const { user } = useAuth();
  const usuarioId = extrairUsuarioId(user);
  const { getCache, setCache, invalidateCacheByPattern } = useCache();

  useEffect(() => {
    carregarBancos();
  }, [usuarioId]);

  /**
   * Carrega bancos da API (com cache)
   */
  const carregarBancos = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        setBanks([]);
        return;
      }

      const cacheKey = `instituicoes:bancos:user:${usuarioIdValido}`;
      
      // Tenta buscar do cache primeiro (a menos que force refresh)
      if (!forceRefresh) {
        const cached = await getCache<Banco[]>(cacheKey);
        if (cached) {
          setBanks(cached);
          setLoading(false);
          return;
        }
      }
      
      const instituicoes = await instituicaoService.listarPorUsuario(usuarioIdValido);
      
      // Filtra apenas bancos usando type
      const bancosList: Banco[] = instituicoes
        .filter((inst: InstituicaoApi) => normalizarTipoInstituicaoDaEntidade(inst) === 'BANCO' && inst.ativo !== false)
        .map((inst: InstituicaoApi) => ({
          id: inst.id,
          nome: inst.nome,
          balance: 'R$ 0,00',
          expenses: 'R$ 0,00',
          cor: inst.cor,
          icone: inst.icone,
          type: 'BANCO',
        }));
      
      // Salva no cache
      await setCache(cacheKey, bancosList);
      
      setBanks(bancosList);
    } catch (err: unknown) {
      console.error('Erro ao carregar bancos:', err);
      setError(getErrorMessage(err, 'Erro ao carregar dados'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove um banco da lista (e suas transações)
   */
  const handleDelete = async (id: string | number) => {
    try {
      if (!idValido(id)) {
        throw new Error('ID de banco inválido para exclusão');
      }

      console.log(`🗑️  Iniciando deleção do banco ID: ${id}`);
      
      // Deleta banco e suas transações
      await instituicaoService.deletar(id);
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarBancos(true);
      
      console.log('✅ Banco e transações deletados com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar banco:', err);
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
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        return;
      }

      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        type: 'BANCO',
        fkUsuario: usuarioIdValido,
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
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        return;
      }

      const type = normalizarTipoInstituicaoDaEntidade(institution);
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        type,
        fkUsuario: usuarioIdValido,
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
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        return;
      }

      const type = normalizarTipoInstituicaoDaEntidade(updatedBank);
      await instituicaoService.atualizar(updatedBank.id, {
        nome: updatedBank.nome,
        icone: updatedBank.icone,
        cor: updatedBank.cor,
        type,
        fkUsuario: usuarioIdValido,
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

  const { user } = useAuth();
  const usuarioId = extrairUsuarioId(user);
  const { getCache, setCache, invalidateCacheByPattern } = useCache();

  useEffect(() => {
    carregarVales();
  }, [usuarioId]);

  /**
   * Carrega vales da API (com cache)
   */
  const carregarVales = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        setVouchers([]);
        return;
      }

      const cacheKey = `instituicoes:vales:user:${usuarioIdValido}`;
      
      // Tenta buscar do cache primeiro (a menos que force refresh)
      if (!forceRefresh) {
        const cached = await getCache<Vale[]>(cacheKey);
        if (cached) {
          setVouchers(cached);
          setLoading(false);
          return;
        }
      }
      
      const instituicoes = await instituicaoService.listarPorUsuario(usuarioIdValido);
      
      // Filtra apenas vales usando type
      const valesList: Vale[] = instituicoes
        .filter((inst: InstituicaoApi) => normalizarTipoInstituicaoDaEntidade(inst) === 'VALE' && inst.ativo !== false)
        .map((inst: InstituicaoApi) => ({
          id: inst.id,
          nome: inst.nome,
          balance: 'R$ 0,00',
          cor: inst.cor,
          icone: inst.icone,
          type: 'VALE',
        }));
      
      // Salva no cache
      await setCache(cacheKey, valesList);
      
      setVouchers(valesList);
    } catch (err: unknown) {
      console.error('Erro ao carregar vales:', err);
      setError(getErrorMessage(err, 'Erro ao carregar dados'));
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
   * Remove um vale da lista (e suas transações)
   */
  const handleDelete = async (voucherId: string | number) => {
    try {
      if (!idValido(voucherId)) {
        throw new Error('ID de vale inválido para exclusão');
      }

      console.log(`🗑️  Iniciando deleção do vale ID: ${voucherId}`);
      
      // Deleta vale e suas transações
      await instituicaoService.deletar(voucherId);
      
      // Invalida o cache e recarrega
      await invalidateCacheByPattern('instituicoes');
      await carregarVales(true);
      
      console.log('✅ Vale e transações deletados com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar vale:', err);
      setError('Erro ao deletar vale');
    }
  };

  /**
   * Adiciona instituição selecionada
   */
  const handleSelectInstitution = async (institution: Instituicao) => {
    try {
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        return;
      }

      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        type: 'VALE',
        fkUsuario: usuarioIdValido,
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
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        return;
      }

      const type = normalizarTipoInstituicaoDaEntidade(institution);
      await instituicaoService.criar({
        nome: institution.nome,
        icone: institution.icone,
        cor: institution.cor,
        type,
        fkUsuario: usuarioIdValido,
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
      const usuarioIdValido = obterUsuarioIdOuErro(usuarioId, (message) => setError(message));
      if (!usuarioIdValido) {
        return;
      }

      const type = normalizarTipoInstituicaoDaEntidade(updatedVoucher);
      await instituicaoService.atualizar(updatedVoucher.id, {
        nome: updatedVoucher.nome,
        icone: updatedVoucher.icone,
        cor: updatedVoucher.cor,
        type,
        fkUsuario: usuarioIdValido,
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
