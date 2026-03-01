import { useState, useEffect } from 'react';
import { transacaoService, categoriaService, instituicaoService } from '../../../api';
import { MOCK_TRANSACTIONS } from '../constants/constantesTransacao';
import { CATEGORIES } from '../constants/constantesTransacao';

export interface Filtros {
  tipo: 'TODOS' | 'RECEITA' | 'GASTO';
  instituicoes: number[];
  categorias: number[];
  valorMin: string;
  valorMax: string;
  apenasParcelado: boolean;
  apenasRecorrente: boolean;
  dataInicio: string;
  dataFim: string;
}

/**
 * Interface para resposta paginada da API
 * Estrutura compatível com padrões REST de paginação
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Hook customizado para gerenciar transações
 * Busca e gerencia transações da API com fallback para dados mockados
 * Suporta paginação infinita (infinite scroll)
 */
export const useGerenciarTransacoes = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState('Período Completo');
  const [ordenacao, setOrdenacao] = useState('Mais recentes');
  const [usandoDadosMockados, setUsandoDadosMockados] = useState(false);
  
  // Estados de paginação
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Itens por página
  const [totalTransacoes, setTotalTransacoes] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: 'TODOS',
    instituicoes: [],
    categorias: [],
    valorMin: '',
    valorMax: '',
    apenasParcelado: false,
    apenasRecorrente: false,
    dataInicio: '',
    dataFim: '',
  });

  const usuarioId = 1;

  /**
   * Carrega transações e dados relacionados ao montar
   */
  useEffect(() => {
    carregarDados();
  }, []);

  /**
   * Simula resposta paginada da API
   * No futuro, substituir por chamada real: await transacaoService.listarPaginado(page, limit)
   */
  const simularPaginacaoAPI = (allTransactions: any[], page: number, limit: number): PaginatedResponse<any> => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allTransactions.slice(startIndex, endIndex);
    const total = allTransactions.length;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: paginatedData,
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    };
  };

  /**
   * Carrega todos os dados da API (com fallback para dados mockados)
   * Carrega primeira página e reseta paginação
   */
  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    
    try {
      console.log('🔄 [LOAD] Carregando dados da API...');
      
      // Carrega categorias e instituições (não paginados)
      const [categoriasData, instituicoesData] = await Promise.all([
        categoriaService.listarPorUsuario(usuarioId),
        instituicaoService.listarPorUsuario(usuarioId)
      ]);
      
      // TODO: Quando backend estiver pronto, substituir por:
      // const response = await transacaoService.listarPaginado(1, limit);
      // setTransacoes(response.data);
      // setTotalTransacoes(response.total);
      // setHasMore(response.hasMore);
      
      // Simulação: carrega todas e pagina no frontend
      const todasTransacoes = await transacaoService.listar();
      const paginatedResponse = simularPaginacaoAPI(todasTransacoes, 1, limit);
      
      console.log(`📊 [LOAD] Dados carregados da API:`);
      console.log(`   • ${paginatedResponse.data.length} transações (página 1/${paginatedResponse.totalPages})`);
      console.log(`   • ${categoriasData.length} categorias`);
      console.log(`   • ${instituicoesData.length} instituições`);
      console.log(`   • Total de transações: ${paginatedResponse.total}`);
      
      setTransacoes(paginatedResponse.data);
      setTotalTransacoes(paginatedResponse.total);
      setHasMore(paginatedResponse.hasMore);
      setCategorias(categoriasData);
      setInstituicoes(instituicoesData);
      setUsandoDadosMockados(false);
    } catch (err: any) {
      console.warn('⚠️  API indisponível, usando dados mockados:', err.message);
      
      // Fallback para dados mockados
      const paginatedResponse = simularPaginacaoAPI(MOCK_TRANSACTIONS, 1, limit);
      setTransacoes(paginatedResponse.data);
      setTotalTransacoes(paginatedResponse.total);
      setHasMore(paginatedResponse.hasMore);
      setCategorias(CATEGORIES);
      setInstituicoes([]);
      setUsandoDadosMockados(true);
      setError('Modo offline - usando dados de exemplo');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega mais transações (infinite scroll)
   * Adiciona próxima página aos dados existentes
   */
  const carregarMaisTransacoes = async () => {
    if (loadingMore || !hasMore) {
      console.log('⏸️  [LOAD MORE] Ignorado:', { loadingMore, hasMore });
      return;
    }

    const nextPage = page + 1;
    setLoadingMore(true);
    
    try {
      console.log(`📄 [LOAD MORE] Carregando página ${nextPage}...`);
      
      // TODO: Quando backend estiver pronto, substituir por:
      // const response = await transacaoService.listarPaginado(nextPage, limit);
      // setTransacoes(prev => [...prev, ...response.data]);
      // setHasMore(response.hasMore);
      // setPage(nextPage);
      
      // Simulação: busca todas e pagina
      const todasTransacoes = usandoDadosMockados 
        ? MOCK_TRANSACTIONS 
        : await transacaoService.listar();
      
      const paginatedResponse = simularPaginacaoAPI(todasTransacoes, nextPage, limit);
      
      console.log(`✅ [LOAD MORE] ${paginatedResponse.data.length} transações carregadas (página ${nextPage}/${paginatedResponse.totalPages})`);
      
      setTransacoes(prev => [...prev, ...paginatedResponse.data]);
      setHasMore(paginatedResponse.hasMore);
      setPage(nextPage);
    } catch (err: any) {
      console.error('❌ [LOAD MORE] Erro:', err);
      setError('Erro ao carregar mais transações');
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Reseta a paginação e recarrega dados
   * Útil após adicionar/editar/deletar transação
   */
  const resetarPaginacao = async () => {
    console.log('🔄 [RESET] Resetando paginação...');
    await carregarDados();
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
    loadingMore,
    error,
    periodo,
    ordenacao,
    filtros,
    usandoDadosMockados,
    
    // Estados de paginação
    page,
    limit,
    totalTransacoes,
    hasMore,
    
    // Modificadores
    setPeriodo,
    setOrdenacao,
    setFiltros,
    
    // Ações
    carregarDados,
    carregarMaisTransacoes,
    resetarPaginacao,
    buscarPorPeriodo,
    buscarPorTipo,
    buscarCategoria,
    buscarInstituicao,
    deletarTransacao,
    criarTransacao,
    atualizarTransacao,
  };
};
