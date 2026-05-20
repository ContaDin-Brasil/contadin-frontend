/**
 * EXEMPLO: Como integrar buscarResumoFinanceiroComIndicadores na Dashboard
 * 
 * Este arquivo mostra como usar o novo endpoint /indicadores-transacoes
 * para melhorar a performance da dashboard.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  buscarIndicadoresTransacoes, 
  buscarResumoFinanceiroComIndicadores 
} from './dashboardService';
import type { ResumoFinanceiro } from '../../telas/dashboard/types/dashboard.types';

// ═══════════════════════════════════════════════════════════════════════════
// OPÇÃO 1: Usar novos endpoints isoladamente (mais controle)
// ═══════════════════════════════════════════════════════════════════════════

export const exemploComEndpointsIsolados = async () => {
  const { user } = useAuth();
  
  if (!user?.id) {
    console.error('Usuário não autenticado');
    return;
  }

  // Converter para string se necessário (já que UUID é string)
  const usuarioId = String(user.id);

  try {
    // Buscar gastos e receitas separadamente
    const gastos = await buscarIndicadoresTransacoes(usuarioId, 'GASTO');
    const receitas = await buscarIndicadoresTransacoes(usuarioId, 'RECEITA');

    console.log('Gastos:', gastos);
    // { mes: 5, tipo: 'GASTO', valorTotal: 350 }
    
    console.log('Receitas:', receitas);
    // { mes: 5, tipo: 'RECEITA', valorTotal: 800 }

    // Você pode usar esses dados diretamente em componentes específicos
    return {
      gastos,
      receitas,
      saldo: receitas.valorTotal - gastos.valorTotal,
    };
  } catch (error) {
    console.error('Erro ao buscar indicadores:', error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// OPÇÃO 2: Usar função consolidada (recomendado)
// ═══════════════════════════════════════════════════════════════════════════

export const exemploComFuncaoConsolidada = async () => {
  const { user } = useAuth();
  
  if (!user?.id) {
    console.error('Usuário não autenticado');
    return;
  }

  const usuarioId = String(user.id);

  try {
    /**
     * buscarResumoFinanceiroComIndicadores já faz:
     * 1. Chamada paralela para GASTO
     * 2. Chamada paralela para RECEITA  
     * 3. Calcula saldo total
     * 4. Formata o mês
     */
    const resumo = await buscarResumoFinanceiroComIndicadores(usuarioId);

    console.log('Resumo financeiro:', resumo);
    // {
    //   saldoTotal: 450,
    //   receitaTotal: 800,
    //   gastoTotal: 350,
    //   mesAtual: "Mai/2026"
    // }

    return resumo;
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// OPÇÃO 3: Hook customizado para integrar na Dashboard
// ═══════════════════════════════════════════════════════════════════════════

export const useResumoFinanceiroMelhorado = () => {
  const { user } = useAuth();
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarResumo = useCallback(async () => {
    if (!user?.id) {
      setErro('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErro(null);

      const usuarioId = String(user.id);
      const dados = await buscarResumoFinanceiroComIndicadores(usuarioId);

      setResumo(dados);
    } catch (error) {
      console.error('Erro ao carregar resumo melhorado:', error);
      setErro('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  return { resumo, loading, erro, atualizar: carregarResumo };
};

// ═══════════════════════════════════════════════════════════════════════════
// OPÇÃO 4: Como integrar no hook useGerenciarDashboard existente
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Alteração sugerida no arquivo:
 * src/telas/dashboard/hooks/useGerenciarDashboard.ts
 */
export const ALTERACAO_SUGERIDA_useGerenciarDashboard = `

import { buscarResumoFinanceiroComIndicadores } from '../../../api/services/dashboardService';

export const useGerenciarDashboard = (usuarioId: number = 1) => {
  // ... código existente ...

  const carregarDados = useCallback(async (forcarAtualizacao = false) => {
    try {
      setLoading(true);
      setErro(null);

      if (USAR_MOCK_DASHBOARD) {
        const dadosMock = buildMockDashboardData();
        setDados(dadosMock);
        await setCache(\`\${CACHE_KEYS.RESUMO}:\${usuarioId}\`, dadosMock, CACHE_TTL.RESUMO);
        setLoading(false);
        return;
      }

      // Tentar buscar do cache primeiro
      if (!forcarAtualizacao) {
        const dadosCache = await getCache<DadosDashboard>(\`\${CACHE_KEYS.RESUMO}:\${usuarioId}\`);
        if (dadosCache) {
          console.log('[Dashboard] Dados carregados do cache');
          setDados(dadosCache);
          setLoading(false);
          return;
        }
      }

      // ███ MUDANÇA: Usar novo endpoint para resumo ███
      console.log('[Dashboard] Buscando dados da API...');
      
      // Buscar resumo com o novo endpoint (mais eficiente)
      const resumoMelhorado = await buscarResumoFinanceiroComIndicadores(String(usuarioId));
      
      // Buscar outros dados (categorias, instituições, previsão)
      const [respGastosPorCategoria, respSaldosPorInstituicao, respPrevisaoSaldo] = await Promise.all([
        buscarGastosPorCategoria(usuarioId),
        buscarSaldosPorInstituicao(usuarioId),
        buscarPrevisaoSaldo(usuarioId),
      ]);

      // Montar o objeto completo
      const dadosApi: DadosDashboard = {
        resumo: resumoMelhorado,
        gastosPorCategoria: respGastosPorCategoria,
        saldosPorInstituicao: respSaldosPorInstituicao,
        previsaoSaldo: respPrevisaoSaldo,
      };
      
      // Salvar no cache
      await setCache(\`\${CACHE_KEYS.RESUMO}:\${usuarioId}\`, dadosApi, CACHE_TTL.RESUMO);
      
      setDados(dadosApi);
      console.log('[Dashboard] Dados carregados com sucesso');
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar dados:', error);

      // Fallback para mock
      const dadosMock = buildMockDashboardData();
      setDados(dadosMock);
      await setCache(\`\${CACHE_KEYS.RESUMO}:\${usuarioId}\`, dadosMock, CACHE_TTL.RESUMO);
      setErro(null);
      console.warn('[Dashboard] Exibindo dados mock por indisponibilidade da API.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId, getCache, setCache]);

  // ... resto do código ...
`;

// ═══════════════════════════════════════════════════════════════════════════
// OPÇÃO 5: Usar em período específico (não apenas mês atual)
// ═══════════════════════════════════════════════════════════════════════════

export const exemploComPeriodoEspecifico = async () => {
  const { user } = useAuth();
  
  if (!user?.id) return;

  const usuarioId = String(user.id);

  try {
    // Buscar dados de um período específico
    const gastosMaio = await buscarIndicadoresTransacoes(usuarioId, 'GASTO', '2026-05');
    const gastosAbril = await buscarIndicadoresTransacoes(usuarioId, 'GASTO', '2026-04');
    
    console.log('Gastos Maio:', gastosMaio.valorTotal);
    console.log('Gastos Abril:', gastosAbril.valorTotal);
    
    // Calcular diferença
    const diferenca = gastosMaio.valorTotal - gastosAbril.valorTotal;
    console.log('Diferença:', diferenca);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DICAS DE IMPLEMENTAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ FAZER:
 * 
 * 1. Converter usuarioId para string antes de chamar:
 *    const usuarioId = String(user.id);
 * 
 * 2. Usar chamadas paralelas para múltiplos indicadores:
 *    const [gastos, receitas] = await Promise.all([
 *      buscarIndicadoresTransacoes(id, 'GASTO'),
 *      buscarIndicadoresTransacoes(id, 'RECEITA'),
 *    ]);
 * 
 * 3. Implementar cache com TTL (ex: 5 minutos):
 *    await setCache(key, dados, 5 * 60 * 1000);
 * 
 * 4. Mostrar loading e erro ao usuário
 * 
 * ❌ NÃO FAZER:
 * 
 * 1. Não chamar para cada tipo separadamente sem cache
 * 2. Não ignorar erros (sempre adicione try-catch com fallback)
 * 3. Não esquecer de converter usuarioId para string
 * 4. Não fazer chamadas desnecessárias (use cache)
 */
