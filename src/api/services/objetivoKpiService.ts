import api from '../config';
import type {
  ObjetivoKpiAcaoRecomendadaResponse,
  ObjetivoKpiImpactoResponse,
  ObjetivoKpiInsightResponse,
  ObjetivoKpiMaiorAlertaResponse,
  ObjetivoKpiNoRitmoResponse,
  ObjetivoKpiQuery,
} from '../types';

const normalizeEnvUrl = (value?: string): string | null => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const unquoted = trimmed.replace(/^['"]|['"]$/g, '').trim();
  return unquoted || null;
};

const getEtlBaseURL = (): string | undefined => {
  const fromEnv =
    normalizeEnvUrl(process.env.EXPO_PUBLIC_PYTHON_BASE_URL);
  return fromEnv || api.defaults.baseURL;
};

const ETL_TIMEOUT_MS = 60000;

const buildKpiParams = (
  fkUsuario: string | number,
  query?: ObjetivoKpiQuery,
): Record<string, string | number> => {
  const params: Record<string, string | number> = { fkUsuario };

  if (query?.dataInicio) params.dataInicio = query.dataInicio;
  if (query?.dataFim) params.dataFim = query.dataFim;
  if (query?.tipoObjetivo) params.tipoObjetivo = query.tipoObjetivo;

  return params;
};

const buildKpiParamsSnakeCase = (
  fkUsuario: string | number,
  query?: ObjetivoKpiQuery,
): Record<string, string | number> => {
  const params: Record<string, string | number> = { fk_usuario: fkUsuario };

  if (query?.dataInicio) params.data_inicio = query.dataInicio;
  if (query?.dataFim) params.data_fim = query.dataFim;
  if (query?.tipoObjetivo) params.tipo_objetivo = query.tipoObjetivo;

  return params;
};

const objetivoKpiService = {
  obterImpactoPrevistoMes: async (
    usuarioId: string | number,
    query?: ObjetivoKpiQuery,
  ): Promise<ObjetivoKpiImpactoResponse> => {
    const response = await api.get<ObjetivoKpiImpactoResponse>('/objetivos/kpis/impacto-previsto', {
      params: buildKpiParams(usuarioId, query),
    });
    return response.data;
  },

  obterObjetivosNoRitmo: async (
    usuarioId: string | number,
    query?: ObjetivoKpiQuery,
  ): Promise<ObjetivoKpiNoRitmoResponse> => {
    const response = await api.get<ObjetivoKpiNoRitmoResponse>('/objetivos/kpis/no-ritmo', {
      params: buildKpiParams(usuarioId, query),
    });
    return response.data;
  },

  obterMaiorAlerta: async (
    usuarioId: string | number,
    query?: ObjetivoKpiQuery,
  ): Promise<ObjetivoKpiMaiorAlertaResponse> => {
    const response = await api.get<ObjetivoKpiMaiorAlertaResponse>('/objetivos/kpis/maior-alerta', {
      params: buildKpiParams(usuarioId, query),
    });
    return response.data;
  },

  obterAcaoRecomendada: async (
    usuarioId: string | number,
    query?: ObjetivoKpiQuery,
  ): Promise<ObjetivoKpiAcaoRecomendadaResponse> => {
    const response = await api.get<ObjetivoKpiAcaoRecomendadaResponse>('/objetivos/kpis/acao-recomendada', {
      baseURL: getEtlBaseURL(),
      timeout: ETL_TIMEOUT_MS,
      params: buildKpiParamsSnakeCase(usuarioId, query),
    });
    return response.data;
  },

  obterInsights: async (usuarioId: string | number): Promise<ObjetivoKpiInsightResponse[]> => {
    const response = await api.get<ObjetivoKpiInsightResponse[]>('/objetivos/kpis/insights', {
      baseURL: getEtlBaseURL(),
      timeout: ETL_TIMEOUT_MS,
      params: { fk_usuario: usuarioId },
    });
    return response.data;
  },
};

export default objetivoKpiService;
