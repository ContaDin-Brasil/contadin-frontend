import { useState, useEffect, useCallback } from 'react';
import { useCache } from '../../../contexts/CacheContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  buscarDadosDashboard,
  buscarResumoFinanceiroComIndicadores,
  buscarGastosPorCategoria,
  buscarSaldosPorInstituicao,
  buscarPrevisaoSaldo,
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
  
  // Para compatibilidade com funções que ainda usam number
  const usuarioId = usuarioIdProp || (user?.id ? Number(user.id) : 1);
  
  console.log('[Dashboard] ══════════════════════════════════════════');
  console.log('[Dashboard] Hook inicializado');
  console.log('[Dashboard] user:', user);
  console.log('[Dashboard] user?.id:', user?.id, '| tipo:', typeof user?.id);
  console.log('[Dashboard] usuarioIdProp:', usuarioIdProp);
  console.log('[Dashboard] usuarioIdString (USADO NO ENDPOINT):', usuarioIdString);
  console.log('[Dashboard] ══════════════════════════════════════════');
  
  const [dados, setDados] = useState<DadosDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState<boolean>(false);


  const carregarDados = useCallback(async (forcarAtualizacao = false) => {
    try {
      setLoading(true);
      setErro(null);

      // ⚠️ AVISO: Se user?.id não está definido, algo está errado com a autenticação
      if (!user?.id && !usuarioIdProp) {
        console.error('[Dashboard] ❌ ERRO: user?.id não está definido!');
        console.error('[Dashboard] Usuário não autenticado ou contexto não carregou');
        throw new Error('Usuário não autenticado');
      }

      // Buscar resumo SEMPRE do endpoint real (nunca mock, nunca cache)
      console.log('[Dashboard] Buscando resumo real da API...');
      console.log('[Dashboard] Chamando buscarResumoFinanceiroComIndicadores com usuarioIdString:', usuarioIdString);
      
      const resumoMelhorado = await buscarResumoFinanceiroComIndicadores(usuarioIdString);
      console.log('[Dashboard] ✅ Resumo carregado:', resumoMelhorado);
      
      // Para outros dados: tentar cache primeiro
      let gastosPorCategoria = [];
      let saldosPorInstituicao = [];
      let previsaoSaldo = undefined;
      
      if (!forcarAtualizacao) {
        const dadosCache = await getCache<DadosDashboard>(`${CACHE_KEYS.RESUMO}:${usuarioId}`);
        if (dadosCache) {
          console.log('[Dashboard] Dados auxiliares carregados do cache');
          gastosPorCategoria = dadosCache.gastosPorCategoria;
          saldosPorInstituicao = dadosCache.saldosPorInstituicao;
          previsaoSaldo = dadosCache.previsaoSaldo;
          
          // Montar dados com resumo real + dados auxiliares do cache
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
      } else {
        console.log('[Dashboard] Atualizando dados (ignorando cache)...');
      }
      
      // Para os outros dados, usar mock ou real baseado em USAR_MOCK_DASHBOARD
      if (USAR_MOCK_DASHBOARD) {
        // Usar mock para dados auxiliares (gráficos, categorias, etc)
        // E usar saldoTotal do mock (mas KPIs de receita/gasto são reais)
        console.log('[Dashboard] Usando dados MOCK para gráficos/categorias/saldoTotal');
        const dadosMock = buildMockDashboardData();
        gastosPorCategoria = dadosMock.gastosPorCategoria;
        saldosPorInstituicao = dadosMock.saldosPorInstituicao;
        previsaoSaldo = dadosMock.previsaoSaldo;
        
        // Manter saldoTotal do mock, mas usar receita/gasto reais
        resumoMelhorado.saldoTotal = dadosMock.resumo.saldoTotal;
      } else {
        // Buscar dados reais em paralelo (com tratamento individual de erros)
        try {
          console.log('[Dashboard] Buscando gastos por categoria...');
          gastosPorCategoria = await buscarGastosPorCategoria(usuarioId);
          console.log('[Dashboard] ✅ Gastos por categoria carregados:', gastosPorCategoria.length, 'itens');
        } catch (err) {
          console.warn('[Dashboard] ⚠️  Erro ao buscar gastos por categoria:', err);
        }

        try {
          console.log('[Dashboard] Buscando saldos por instituição...');
          saldosPorInstituicao = await buscarSaldosPorInstituicao(usuarioId);
          console.log('[Dashboard] ✅ Saldos por instituição carregados:', saldosPorInstituicao.length, 'itens');
        } catch (err) {
          console.warn('[Dashboard] ⚠️  Erro ao buscar saldos por instituição:', err);
        }

        try {
          console.log('[Dashboard] Buscando previsão de saldo...');
          previsaoSaldo = await buscarPrevisaoSaldo(usuarioId);
          console.log('[Dashboard] ✅ Previsão de saldo carregada');
        } catch (err) {
          console.warn('[Dashboard] ⚠️  Erro ao buscar previsão de saldo:', err);
        }
      }

      // Montar o objeto completo (resumo real + dados auxiliares)
      const dadosApi: DadosDashboard = {
        resumo: resumoMelhorado, // Sempre real
        gastosPorCategoria,
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
        const dadosFallback = await buscarDadosDashboard(usuarioId);
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
      
      // Chamar com forceUpdate=true para ignorar cache
      await carregarDados(true);
      
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
  }, [usuarioId, invalidateCache, carregarDados]);


  useEffect(() => {
    // Se USAR_MOCK_DASHBOARD foi desativado, limpar cache antigo com dados mock
    if (!USAR_MOCK_DASHBOARD) {
      invalidateCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`).then(() => {
        carregarDados(true); // Forçar atualização
      });
    } else {
      carregarDados();
    }
    
    // Recarregar sempre que o usuário mudar (login/logout)
    console.log('[Dashboard] useEffect disparado - usuarioIdString agora é:', usuarioIdString);
  }, [carregarDados, usuarioId, usuarioIdString, invalidateCache]);

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
    gastosPorCategoria: dados?.gastosPorCategoria || [],
    saldosPorInstituicao: dados?.saldosPorInstituicao || [],
    previsaoSaldo: dados?.previsaoSaldo,
  };
};
