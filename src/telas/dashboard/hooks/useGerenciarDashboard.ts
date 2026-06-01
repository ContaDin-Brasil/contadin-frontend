import { useState, useEffect, useCallback } from 'react';
import { useCache } from '../../../contexts/CacheContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  buscarDadosDashboard,
  buscarResumoFinanceiroComIndicadores,
  buscarGastosPorCategoria,
  buscarGastosPorCategoriaEndpoint,
  buscarSaldosPorInstituicao,
  buscarPrevisaoSaldo,
  buscarSaldoConsolidadoAtual,
  usuarioPossuiTransacoes,
} from '../../../api/services/dashboardService';
import {
  CACHE_KEYS,
  CACHE_TTL,
  SAUDACOES,
  USAR_MOCK_DASHBOARD,
} from '../constants/constantesDashboard';
import type { DadosDashboard } from '../types/dashboard.types';
import { buildMockDashboardData } from '../mocks/mockDashboardData';

export const useGerenciarDashboard = (usuarioIdProp?: number) => {
  const { user } = useAuth();
  const { getCache, setCache, invalidateCache } = useCache();
  
  // IMPORTANTE: user?.id é string|number, não converter para Number!
  // Se user?.id não existe, usar o prop (para testes)
  const usuarioIdString = (() => {
    if (user?.id) {
      return String(user.id); // UUID do usuário autenticado
    }
    if (usuarioIdProp) {
      return String(usuarioIdProp);
    }
    return '1'; // Fallback apenas se nenhum ID estiver disponível
  })();
  
  // Não converter UUID para Number - gera NaN
  // Usar sempre string para cache e parâmetros
  const usuarioId = usuarioIdString;
  
  // Para funções legadas que ainda esperam number, usar hash simples da string ou fallback
  const usuarioIdNumero = usuarioIdProp || 1; // Se houver prop number, usar; senão fallback
  
  const [dados, setDados] = useState<DadosDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [saldoConsolidado, setSaldoConsolidado] = useState<number | null>(null);
  const [temTransacoes, setTemTransacoes] = useState<boolean>(false);

  const fetchSaldoConsolidado = useCallback(async () => {
    if (!user?.id && !usuarioIdProp) return;
    try {
      const saldo = await buscarSaldoConsolidadoAtual(usuarioId);
      setSaldoConsolidado(saldo);
    } catch (err) {
      console.warn('[Dashboard] Erro ao buscar saldo consolidado:', err);
    }
  }, [usuarioId, user?.id, usuarioIdProp]);


  const carregarDados = useCallback(async (forcarAtualizacao = false) => {
    try {
      setLoading(true);
      setErro(null);

      // ⚠️ AVISO: Se user?.id não está definido, algo está errado com a autenticação
      if (!user?.id && !usuarioIdProp) {
        console.error('[Dashboard] Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      const [resumoMelhorado, possuiTransacoes] = await Promise.all([
        buscarResumoFinanceiroComIndicadores(usuarioIdString),
        usuarioPossuiTransacoes(usuarioIdString),
      ]);

      setTemTransacoes(possuiTransacoes);

      // Para outros dados: tentar cache primeiro
      let gastosPorCategoria = [];
      let saldosPorInstituicao = [];
      let previsaoSaldo = undefined;
      
      if (!forcarAtualizacao) {
        const dadosCache = await getCache<DadosDashboard>(`${CACHE_KEYS.RESUMO}:${usuarioId}`);
        if (dadosCache) {
          gastosPorCategoria = dadosCache.gastosPorCategoria;
          saldosPorInstituicao = dadosCache.saldosPorInstituicao;
          previsaoSaldo = dadosCache.previsaoSaldo;
          
          const dadosCompletos: DadosDashboard = {
            resumo: resumoMelhorado,
            gastosPorCategoria,
            saldosPorInstituicao,
            previsaoSaldo,
          };
          setDados(dadosCompletos);
          setLoading(false);
          return;
        }
      }
      
      // Para os outros dados, usar mock ou real baseado em USAR_MOCK_DASHBOARD
      if (USAR_MOCK_DASHBOARD) {
        const dadosMock = buildMockDashboardData();
        saldosPorInstituicao = dadosMock.saldosPorInstituicao;
        previsaoSaldo = dadosMock.previsaoSaldo;
        
        resumoMelhorado.saldoTotal = dadosMock.resumo.saldoTotal;
        
        try {
          const dataAtual = new Date();
          
          gastosPorCategoria = await buscarGastosPorCategoriaEndpoint(
            usuarioIdString,
            dataAtual.getMonth() + 1,
            dataAtual.getFullYear()
          );
        } catch (err) {
          gastosPorCategoria = dadosMock.gastosPorCategoria;
        }
      } else {
        try {
          const dataAtual = new Date();
          gastosPorCategoria = await buscarGastosPorCategoriaEndpoint(
            usuarioIdString,
            dataAtual.getMonth() + 1,
            dataAtual.getFullYear()
          );
        } catch (err) {
          console.error('[Dashboard] Erro ao buscar gastos por categoria:', err);
        }

        try {
          saldosPorInstituicao = await buscarSaldosPorInstituicao(usuarioIdNumero);
        } catch (err) {
          console.error('[Dashboard] Erro ao buscar saldos por instituição:', err);
        }

        try {
          console.log('[Dashboard] Buscando previsão de saldo...');
          previsaoSaldo = await buscarPrevisaoSaldo(usuarioIdNumero);
          console.log('[Dashboard] ✅ Previsão de saldo carregada');
        } catch (err) {
          console.warn('[Dashboard] ⚠️  Erro ao buscar previsão de saldo:', err);
        }
      }

      // Validar e limpar dados - remover items com valor 0 ou inválido
      const gastosPorCategoriaLimpo = (gastosPorCategoria || []).filter(
        (item) => item && item.valor && item.valor > 0 // Apenas items com valor > 0
      );
      
      console.log('[Dashboard] Gastos por categoria antes da limpeza:', gastosPorCategoria?.length || 0, 'itens');
      console.log('[Dashboard] Gastos por categoria após limpeza (valor > 0):', gastosPorCategoriaLimpo.length, 'itens');
      if (gastosPorCategoriaLimpo.length > 0) {
        console.log('[Dashboard] Primeiro item após limpeza:', gastosPorCategoriaLimpo[0]);
      }

      // Montar o objeto completo (resumo real + dados auxiliares)
      const dadosApi: DadosDashboard = {
        resumo: resumoMelhorado, // Sempre real
        gastosPorCategoria: gastosPorCategoriaLimpo,
        saldosPorInstituicao,
        previsaoSaldo,
      };

      console.log('[Dashboard] 📦 Dados completos a salvar:', dadosApi);

      // Salvar no cache
      await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dadosApi, CACHE_TTL.RESUMO);
      console.log('[Dashboard] ✅ Dados salvos no cache');
      
      setDados(dadosApi);
      console.log('[Dashboard] ✅ Dados salvos no estado (setDados)');
      console.log('[Dashboard] ✅ Dados carregados com sucesso (resumo real + dados auxiliares)');
    } catch (error) {
      console.error('[Dashboard] ❌ Erro ao carregar dados:', error);
      if (error instanceof Error) {
        console.error('[Dashboard] Mensagem de erro:', error.message);
        console.error('[Dashboard] Stack:', error.stack);
      }
      
      // Tentar extrair detalhes da resposta HTTP se for AxiosError
      if ((error as any)?.response) {
        console.error('[Dashboard] Status HTTP:', (error as any).response.status);
        console.error('[Dashboard] URL chamada:', (error as any).response.config?.url);
        console.error('[Dashboard] Response data:', (error as any).response.data);
      }

      // Fallback para buscar dados da forma tradicional (se o novo endpoint falhar)
      try {
        console.warn('[Dashboard] Tentando fallback para buscarDadosDashboard...');
        const dadosFallback = await buscarDadosDashboard(usuarioIdNumero);
        console.log('[Dashboard] ✅ Fallback retornou dados:', dadosFallback);
        setDados(dadosFallback);
        await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dadosFallback, CACHE_TTL.RESUMO);
        setErro(null);
        console.log('[Dashboard] Dados carregados com sucesso (fallback)');
      } catch (fallbackError) {
        console.error('[Dashboard] ❌ Erro no fallback também:', fallbackError);
        if (fallbackError instanceof Error) {
          console.error('[Dashboard] Mensagem fallback:', fallbackError.message);
        }
        
        // Último recurso: usar mock
        const dadosMock = buildMockDashboardData();
        console.warn('[Dashboard] Usando dados MOCK como último recurso');
        setDados(dadosMock);
        setTemTransacoes(true);
        await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dadosMock, CACHE_TTL.RESUMO);
        setErro(null);
        console.warn('[Dashboard] Exibindo dados mock por indisponibilidade da API.');
      }
    } finally {
      setLoading(false);
    }
  }, [usuarioId, getCache, setCache]);


  const atualizarDados = useCallback(async () => {
    try {
      setAtualizando(true);
      setErro(null);

      // Invalidar cache para forçar atualização
      await invalidateCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`);

      // Busca os dados do dashboard e o saldo consolidado em paralelo
      await Promise.all([carregarDados(true), fetchSaldoConsolidado()]);

      console.log('[Dashboard] Dados atualizados com sucesso');
    } catch (error) {
      console.error('[Dashboard] Erro ao atualizar dados:', error);
      setErro('Erro ao atualizar dados');
    } finally {
      // Pequeno delay para garantir que o RefreshControl feche suavemente
      setTimeout(() => {
        setAtualizando(false);
      }, 300);
    }
  }, [usuarioId, invalidateCache, carregarDados, fetchSaldoConsolidado]);


  useEffect(() => {
    // Se USAR_MOCK_DASHBOARD foi desativado, limpar cache antigo com dados mock
    if (!USAR_MOCK_DASHBOARD) {
      invalidateCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`).then(() => {
        carregarDados(true); // Forçar atualização
      });
    } else {
      carregarDados();
    }

    fetchSaldoConsolidado();

    // Recarregar sempre que o usuário mudar (login/logout)
    console.log('[Dashboard] useEffect disparado - usuarioIdString agora é:', usuarioIdString);
  }, [carregarDados, usuarioId, usuarioIdString, invalidateCache, fetchSaldoConsolidado]);

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
    resumo: (() => {
      console.log('[Dashboard] RENDERIZAÇÃO - resumo:', dados?.resumo);
      return dados?.resumo;
    })(),
    gastosPorCategoria: (() => {
      console.log('[Dashboard] RENDERIZAÇÃO - gastosPorCategoria:', dados?.gastosPorCategoria);
      console.log('[Dashboard] - Array length:', (dados?.gastosPorCategoria || []).length);
      return dados?.gastosPorCategoria || [];
    })(),
    saldosPorInstituicao: dados?.saldosPorInstituicao || [],
    previsaoSaldo: dados?.previsaoSaldo,
    saldoConsolidado,
    temTransacoes,
  };
};
