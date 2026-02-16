import { useState, useEffect } from 'react';
import { transacaoService, categoriaService, instituicaoService } from '../../../api';

/**
 * Hook customizado para gerenciar transações
 * Busca e gerencia transações da API
 */
export const useGerenciarTransacoes = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState('Período Completo');
  const [ordenacao, setOrdenacao] = useState('Mais recentes');

  const usuarioId = 1;

  /**
   * Carrega transações e dados relacionados ao montar
   */
  useEffect(() => {
    carregarDados();
  }, []);

  /**
   * Carrega todos os dados da API
   */
  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [transacoesData, categoriasData, instituicoesData] = await Promise.all([
        transacaoService.listar(),
        categoriaService.listarPorUsuario(usuarioId),
        instituicaoService.listarPorUsuario(usuarioId)
      ]);
      
      setTransacoes(transacoesData);
      setCategorias(categoriasData);
      setInstituicoes(instituicoesData);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca transações por período
   */
  const buscarPorPeriodo = async (dataInicio: string, dataFim: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const transacoesData = await transacaoService.listarPorPeriodo(dataInicio, dataFim);
      setTransacoes(transacoesData);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      setError(err.message || 'Erro ao buscar transações');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca transações por tipo
   */
  const buscarPorTipo = async (tipo: 'GASTO' | 'RECEITA') => {
    setLoading(true);
    setError(null);
    
    try {
      const transacoesData = await transacaoService.listarPorTipo(tipo);
      setTransacoes(transacoesData);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      setError(err.message || 'Erro ao buscar transações');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca categoria por ID
   */
  const buscarCategoria = (categoriaId: number) => {
    return categorias.find(cat => cat.id === categoriaId);
  };

  /**
   * Busca instituição por ID
   */
  const buscarInstituicao = (instituicaoId: number) => {
    return instituicoes.find(inst => inst.id === instituicaoId);
  };

  /**
   * Deleta uma transação
   */
  const deletarTransacao = async (id: number) => {
    try {
      await transacaoService.deletar(id);
      setTransacoes(transacoes.filter(t => t.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar transação:', err);
      setError(err.message || 'Erro ao deletar transação');
      throw err;
    }
  };

  /**
   * Cria uma nova transação
   */
  const criarTransacao = async (transacao: any) => {
    try {
      const novaTransacao = await transacaoService.criar(transacao);
      setTransacoes([novaTransacao, ...transacoes]);
      return novaTransacao;
    } catch (err: any) {
      console.error('Erro ao criar transação:', err);
      setError(err.message || 'Erro ao criar transação');
      throw err;
    }
  };

  /**
   * Atualiza uma transação
   */
  const atualizarTransacao = async (id: number, transacao: any) => {
    try {
      const transacaoAtualizada = await transacaoService.atualizar(id, transacao);
      setTransacoes(transacoes.map(t => t.id === id ? transacaoAtualizada : t));
      return transacaoAtualizada;
    } catch (err: any) {
      console.error('Erro ao atualizar transação:', err);
      setError(err.message || 'Erro ao atualizar transação');
      throw err;
    }
  };

  return {
    // Estados
    transacoes,
    categorias,
    instituicoes,
    loading,
    error,
    periodo,
    ordenacao,
    
    // Modificadores
    setPeriodo,
    setOrdenacao,
    
    // Ações
    carregarDados,
    buscarPorPeriodo,
    buscarPorTipo,
    buscarCategoria,
    buscarInstituicao,
    deletarTransacao,
    criarTransacao,
    atualizarTransacao,
  };
};
