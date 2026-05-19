import { useCallback, useEffect, useMemo, useState } from 'react';
import { objetivoGastoService, objetivoKpiService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';
import { extrairUsuarioId } from '../../../utils/normalizacao';
import type { ObjetivoKpiQuery } from '@/api/types';
import type { ObjetivoUi, ResumoObjetivos } from '@/telas/configuracoes/objetivos/types/objetivo.types';
import { carregarCategoriasObjetivos } from '@/telas/configuracoes/objetivos/utils/objetivoCategorias';
import { mapearObjetivo } from '@/telas/configuracoes/objetivos/utils/objetivoMapper';
import { formatarDataISO } from '@/utils/dateUtils';

const RESUMO_INICIAL: ResumoObjetivos = {
  total: 0,
  noRitmo: 0,
  impacto: 0,
  maiorAlerta: '--',
  recomendacao: 'Sem recomendações para esta semana.',
};

export const useGerenciarObjetivos = () => {
  const { user } = useAuth();
  const usuarioId = extrairUsuarioId(user);
  const [objetivosAtivos, setObjetivosAtivos] = useState<ObjetivoUi[]>([]);
  const [objetivosConcluidos, setObjetivosConcluidos] = useState<ObjetivoUi[]>([]);
  const [resumo, setResumo] = useState<ResumoObjetivos>(RESUMO_INICIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'ativos' | 'concluidos'>('ativos');
  const [tipoKpi, setTipoKpi] = useState<'todos' | 'gasto' | 'receita'>('todos');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const obterPeriodoAtual = () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const dataInicio = formatarDataISO(inicio) || undefined;
    const dataFim = formatarDataISO(fim) || undefined;
    return { dataInicio, dataFim };
  };

  const obterMensagemErroIa = (erro: any, tipo: 'acao' | 'insight'): string => {
    const status = erro?.response?.status;
    if (status === 503) {
      return tipo === 'acao'
        ? 'IA indisponivel no momento. Tente novamente.'
        : 'Insights indisponiveis no momento. Tente novamente.';
    }
    return tipo === 'acao'
      ? 'Não foi possivel carregar a açao recomendada.'
      : 'Não foi possivel carregar os insights.';
  };

  const carregarObjetivos = useCallback(async () => {
    if (!usuarioId) {
      setError('Sessao invalida. Faca login novamente.');
      setResumo(RESUMO_INICIAL);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const termo = debouncedQuery.trim();
      const buscar = termo
        ? (concluido: boolean) =>
            objetivoGastoService.buscarPorNome(termo, usuarioId, concluido)
        : (concluido: boolean) => objetivoGastoService.listarPorUsuario(usuarioId, concluido);

      const { dataInicio, dataFim } = obterPeriodoAtual();
      const tipoObjetivo: 'LIMITE_GASTO' | 'AUMENTO_RECEITA' | undefined =
        tipoKpi === 'gasto'
          ? 'LIMITE_GASTO'
          : tipoKpi === 'receita'
            ? 'AUMENTO_RECEITA'
            : undefined;
      const kpiQuery: ObjetivoKpiQuery = {
        dataInicio,
        dataFim,
        ...(tipoObjetivo ? { tipoObjetivo } : {}),
      };
      const [categorias, ativos, concluidos, impactoResp, noRitmoResp, maiorAlertaResp] = await Promise.all([
        carregarCategoriasObjetivos(usuarioId),
        buscar(false),
        buscar(true),
        objetivoKpiService.obterImpactoPrevistoMes(usuarioId, kpiQuery),
        objetivoKpiService.obterObjetivosNoRitmo(usuarioId, kpiQuery),
        objetivoKpiService.obterMaiorAlerta(usuarioId, kpiQuery),
      ]);

      const [acaoResult, insightsResult] = await Promise.allSettled([
        objetivoKpiService.obterAcaoRecomendada(usuarioId, kpiQuery),
        objetivoKpiService.obterInsights(usuarioId),
      ]);

      const categoriaMap = new Map(categorias.map((categoria) => [String(categoria.id), categoria.nome]));
      let insightsMap = new Map<string, string>();
      if (insightsResult.status === 'fulfilled') {
        insightsMap = new Map(
          (insightsResult.value || []).map((item) => [String(item.objetivo_id), item.insight || '']),
        );
      } else {
        const insightFallback = obterMensagemErroIa(insightsResult.reason, 'insight');
        [...ativos, ...concluidos].forEach((item) => {
          insightsMap.set(String(item.id), insightFallback);
        });
      }

      setObjetivosAtivos(ativos.map((item) => mapearObjetivo(item, categoriaMap, insightsMap)));
      setObjetivosConcluidos(concluidos.map((item) => mapearObjetivo(item, categoriaMap, insightsMap)));

      const totalObjetivos =
        typeof noRitmoResp?.totalObjetivos === 'number'
          ? noRitmoResp.totalObjetivos
          : ativos.length + concluidos.length;
      const objetivosNoRitmo =
        typeof noRitmoResp?.objetivosNoRitmo === 'number' ? noRitmoResp.objetivosNoRitmo : 0;
      const impacto =
        typeof impactoResp?.impactoPrevistoMes === 'number' ? impactoResp.impactoPrevistoMes : 0;
      const maiorAlerta = maiorAlertaResp?.maiorAlerta || '--';
      let recomendacao = RESUMO_INICIAL.recomendacao;
      if (acaoResult.status === 'fulfilled') {
        recomendacao = acaoResult.value?.acao_recomendada || RESUMO_INICIAL.recomendacao;
      } else {
        recomendacao = obterMensagemErroIa(acaoResult.reason, 'acao');
      }

      setResumo({
        total: totalObjetivos,
        noRitmo: objetivosNoRitmo,
        impacto,
        maiorAlerta,
        recomendacao,
      });
    } catch (err: any) {
      setError(err?.message || 'Não foi possivel carregar os objetivos.');
      setResumo(RESUMO_INICIAL);
    } finally {
      setLoading(false);
    }
  }, [usuarioId, debouncedQuery, tipoKpi]);

  useEffect(() => {
    carregarObjetivos();
  }, [carregarObjetivos]);

  const objetivos = useMemo(() => {
    return filtroStatus === 'concluidos' ? objetivosConcluidos : objetivosAtivos;
  }, [filtroStatus, objetivosAtivos, objetivosConcluidos]);

  const contagem = useMemo(() => {
    return {
      ativos: objetivosAtivos.length,
      concluidos: objetivosConcluidos.length,
    };
  }, [objetivosAtivos, objetivosConcluidos]);

  return {
    objetivos,
    resumo,
    contagem,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filtroStatus,
    setFiltroStatus,
    tipoKpi,
    setTipoKpi,
    recarregar: carregarObjetivos,
  };
};
