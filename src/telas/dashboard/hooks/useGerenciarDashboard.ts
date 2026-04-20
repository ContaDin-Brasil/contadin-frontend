import { useState, useEffect, useCallback } from 'react';
import { useCache } from '../../../contexts/CacheContext';
import { buscarDadosDashboard } from '../../../api/services/dashboardService';
import {
  CACHE_KEYS,
  CACHE_TTL,
  SAUDACOES,
  USAR_MOCK_DASHBOARD,
} from '../constants/constantesDashboard';
import type { DadosDashboard } from '../types/dashboard.types';
import { buildMockDashboardData } from '../mocks/mockDashboardData';

export const useGerenciarDashboard = (usuarioId: number = 1) => {
  const { getCache, setCache, invalidateCache } = useCache();
  
  const [dados, setDados] = useState<DadosDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState<boolean>(false);


  const carregarDados = useCallback(async (forcarAtualizacao = false) => {
    try {
      setLoading(true);
      setErro(null);

      if (USAR_MOCK_DASHBOARD) {
        const dadosMock = buildMockDashboardData();
        setDados(dadosMock);
        await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dadosMock, CACHE_TTL.RESUMO);
        setLoading(false);
        return;
      }

      // Tentar buscar do cache primeiro (se não for atualização forçada)
      if (!forcarAtualizacao) {
        const dadosCache = await getCache<DadosDashboard>(`${CACHE_KEYS.RESUMO}:${usuarioId}`);
        if (dadosCache) {
          console.log('[Dashboard] Dados carregados do cache');
          setDados(dadosCache);
          setLoading(false);
          return;
        }
      }

      // Buscar da API
      console.log('[Dashboard] Buscando dados da API...');
      const dadosApi = await buscarDadosDashboard(usuarioId);
      
      // Salvar no cache
      await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dadosApi, CACHE_TTL.RESUMO);
      
      setDados(dadosApi);
      console.log('[Dashboard] Dados carregados com sucesso');
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar dados:', error);

      // Fallback para mock enquanto endpoint dedicado de dashboard não existe.
      const dadosMock = buildMockDashboardData();
      setDados(dadosMock);
      await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dadosMock, CACHE_TTL.RESUMO);
      setErro(null);
      console.warn('[Dashboard] Exibindo dados mock por indisponibilidade da API.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId, getCache, setCache]);


  const atualizarDados = useCallback(async () => {
    try {
      setAtualizando(true);
      setErro(null);

      await invalidateCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`);
      
      await carregarDados(true);
      
      console.log('[Dashboard] Dados atualizados');
    } catch (error) {
      console.error('[Dashboard] Erro ao atualizar dados:', error);
      setErro('Erro ao atualizar dados');
    } finally {
      setAtualizando(false);
    }
  }, [usuarioId, invalidateCache, carregarDados]);


  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  /**
   * Retorna saudação baseada na hora do dia (Pegando informação do dis positivo para respeitar fuso horário)
   */
  const obterSaudacao = useCallback(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const horaDispositivo = parseInt(
      new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone }),
      10
    );
    if (horaDispositivo >= SAUDACOES.HORA_INICIO_MANHA && horaDispositivo < SAUDACOES.HORA_FIM_MANHA)
      return SAUDACOES.MANHA;
    if (horaDispositivo >= SAUDACOES.HORA_FIM_MANHA && horaDispositivo < SAUDACOES.HORA_FIM_TARDE)
      return SAUDACOES.TARDE;
    return SAUDACOES.NOITE;
  }, []);


  const formatarMoeda = useCallback((valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }, []);

  return {
    // Estados
    dados,
    loading,
    erro,
    atualizando,

    // Funções
    carregarDados,
    atualizarDados,
    obterSaudacao,
    formatarMoeda,

    // Dados específicos (para facilitar o acesso)
    resumo: dados?.resumo,
    gastosPorCategoria: dados?.gastosPorCategoria || [],
    saldosPorInstituicao: dados?.saldosPorInstituicao || [],
    previsaoSaldo: dados?.previsaoSaldo,
  };
};
