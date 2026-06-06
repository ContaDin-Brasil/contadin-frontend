import api from '../config';
import type { TransacaoApi, TransacaoPayload } from '../types';
import { normalizarId } from '../../utils/normalizacao';
import type {
  ListarTransacoesParams,
  TransacoesPaginadas,
} from '../../telas/transacoes/types/transacao.types';

type EnvelopeArray<T> = {
  data?: T[];
  content?: T[];
  items?: T[];
};

type PaginatedEnvelope<T> = EnvelopeArray<T> & {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
};

const DEFAULT_LIMIT = 100;
const MAX_AUTO_PAGES = 100;

const toFiniteNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }

  return fallback;
};

const extractFkCategoria = (source: Record<string, unknown>): string | number | null => {
  return normalizarId(source.fkCategoria);
};

const extractFkInstituicao = (source: Record<string, unknown>): string | number | null => {
  return normalizarId(source.fkInstituicao);
};

const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
};

const normalizeTransacao = (item: unknown): TransacaoApi => {
  const source = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;

  return {
    id: normalizarId(source.id) ?? '',
    descricao: asString(source.descricao),
    valor: toFiniteNumber(source.valor, 0),
    tipo: (source.tipo as TransacaoApi['tipo']) ?? 'GASTO',
    dataTransacao: asString(source.dataTransacao ?? source.data_transacao ?? source.criadoEm),
    parcelado: toBoolean(source.parcelado, false),
    qtdParcelas: toFiniteNumber(source.qtdParcelas ?? source.qtd_parcelas, 1),
    recorrencia: (source.recorrencia as TransacaoApi['recorrencia']) ?? null,
    fimRecorrencia:
      source.fimRecorrencia === null || source.fim_recorrencia === null
        ? null
        : asString(source.fimRecorrencia ?? source.fim_recorrencia, ''),
    ativo: typeof source.ativo === 'boolean' ? source.ativo : null,
    fkInstituicao: extractFkInstituicao(source),
    fkCategoria: extractFkCategoria(source),
    criadoEm: asString(source.criadoEm),
    atualizadoEm: asString(source.atualizadoEm),
  };
};

const normalizeLista = (payload: unknown): TransacaoApi[] => {
  return toArray<unknown>(payload).map((item) => normalizeTransacao(item));
};

const normalizePaginado = (
  payload: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): TransacoesPaginadas<TransacaoApi> => {
  const dataNormalizada = normalizeLista(payload);

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      data: dataNormalizada,
      page: fallbackPage,
      limit: fallbackLimit,
      total: dataNormalizada.length,
      totalPages: dataNormalizada.length > 0 ? 1 : 0,
      hasMore: false,
    };
  }

  const source = payload as PaginatedEnvelope<unknown>;
  const page = toFiniteNumber(source.page, fallbackPage);
  const limit = toFiniteNumber(source.limit, fallbackLimit);
  const total = toFiniteNumber(source.total, dataNormalizada.length);
  const totalPages = toFiniteNumber(
    source.totalPages,
    limit > 0 ? Math.ceil(total / limit) : 0,
  );

  const hasMore =
    typeof source.hasMore === 'boolean'
      ? source.hasMore
      : totalPages > 0 && page < totalPages;

  return {
    data: dataNormalizada,
    page,
    limit,
    total,
    totalPages,
    hasMore,
  };
};

const cleanParams = (params: Record<string, unknown>): Record<string, unknown> => {
  const entries = Object.entries(params).filter(([, value]) => {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  });

  return Object.fromEntries(entries);
};

const normalizeSortField = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  const allowed: Record<string, string> = {
    dataTransacao: 'data_transacao',
    valor: 'valor',
    descricao: 'descricao',
  };

  return allowed[normalized];
};

const toApiQueryParams = (params: ListarTransacoesParams): Record<string, unknown> => {
  return cleanParams({
    _page: params._page,
    _limit: params._limit,
    _sort: normalizeSortField(params._sort),
    _order: params._order,
    tipo: params.tipo,
    fk_instituicao: params.fkInstituicao,
    fk_categoria: params.fkCategoria,
    valor_gte: params.valorGte,
    valor_lte: params.valorLte,
    parcelado: params.parcelado,
    recorrente: params.recorrente,
    data_transacao_gte: params.dataTransacaoGte,
    data_transacao_lte: params.dataTransacaoLte,
    search: params.search,
  });
};

const mapPayloadToBackend = (payload: TransacaoPayload): Record<string, unknown> => {
  const source = payload as unknown as Record<string, unknown>;

  return cleanParams({
    descricao: asString(source.descricao),
    valor: toFiniteNumber(source.valor, 0),
    tipo: source.tipo,
    dataTransacao: asString(source.dataTransacao ?? source.data_transacao),
    parcelado: toBoolean(source.parcelado, false),
    qtdParcelas: source.qtdParcelas ?? source.qtd_parcelas,
    recorrencia: source.recorrencia ?? null,
    fimRecorrencia: source.fimRecorrencia ?? source.fim_recorrencia ?? null,
    ativo: typeof source.ativo === 'boolean' ? source.ativo : true,
    fkInstituicao: normalizarId(source.fkInstituicao),
    fkCategoria: normalizarId(source.fkCategoria),
  });
};

const toArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const source = payload as EnvelopeArray<T>;
    if (Array.isArray(source.data)) {
      return source.data;
    }
    if (Array.isArray(source.content)) {
      return source.content;
    }
    if (Array.isArray(source.items)) {
      return source.items;
    }
  }

  return [];
};

/**
 * Serviço de Transações
 * Gerencia operações relacionadas a gastos e receitas
 */
const transacaoService = {
  /**
   * Lista transações com filtros dinâmicos.
   * Se paginação não for informada, agrega todas as páginas automaticamente.
   */
  listar: async (params: ListarTransacoesParams = {}): Promise<TransacaoApi[]> => {
    const solicitouPaginaUnica = params._page !== undefined || params._limit !== undefined;

    if (solicitouPaginaUnica) {
      const paginado = await transacaoService.listarPaginado(params);
      return paginado.data;
    }

    const limite = DEFAULT_LIMIT;
    const acumulado: TransacaoApi[] = [];
    const visitados = new Set<string | number>();
    let paginaAtual = 1;

    while (paginaAtual <= MAX_AUTO_PAGES) {
      const resultado = await transacaoService.listarPaginado({
        ...params,
        _page: paginaAtual,
        _limit: limite,
      });

      for (const item of resultado.data) {
        const key = item.id;
        if (!visitados.has(key)) {
          visitados.add(key);
          acumulado.push(item);
        }
      }

      if (!resultado.hasMore) {
        break;
      }

      paginaAtual += 1;
    }

    return acumulado;
  },

  /**
   * Lista transações com retorno paginado nativo da API.
   */
  listarPaginado: async (
    params: ListarTransacoesParams = {},
  ): Promise<TransacoesPaginadas<TransacaoApi>> => {
    const page = params._page ?? 1;
    const limit = params._limit ?? DEFAULT_LIMIT;

    const response = await api.get<TransacaoApi[] | EnvelopeArray<TransacaoApi> | PaginatedEnvelope<TransacaoApi>>(
      '/transacao',
      { params: toApiQueryParams({ ...params, _page: page, _limit: limit }) },
    );

    return normalizePaginado(response.data, page, limit);
  },

  /**
   * Busca transações por usuário
   * Nota: Como transações não têm fk_usuario diretamente, 
   * retorna todas as transações (que serão filtradas por instituições do usuário)
   * @param {string | number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (_usuarioId: string | number): Promise<TransacaoApi[]> => {
    return transacaoService.listar();
  },

  /**
   * Busca uma transação por ID
   * @param {string} id - UUID da transação
   */
  buscarPorId: async (id: string | number): Promise<TransacaoApi> => {
    const response = await api.get<TransacaoApi>(`/transacao/${id}`);
    return normalizeTransacao(response.data);
  },

  /**
   * Busca transações por instituição
   * @param {number} instituicaoId - ID da instituição
   */
  listarPorInstituicao: async (instituicaoId: string | number): Promise<TransacaoApi[]> => {
    return transacaoService.listar({ fkInstituicao: instituicaoId });
  },

  /**
   * Busca transações por categoria
   * @param {number} categoriaId - ID da categoria
   */
  listarPorCategoria: async (categoriaId: string | number): Promise<TransacaoApi[]> => {
    return transacaoService.listar({ fkCategoria: categoriaId });
  },

  /**
   * Busca transações por tipo (GASTO ou RECEITA)
   * @param {string} tipo - Tipo da transação ('GASTO' ou 'RECEITA')
   */
  listarPorTipo: async (tipo: TransacaoApi['tipo']): Promise<TransacaoApi[]> => {
    return transacaoService.listar({ tipo });
  },

  /**
   * Busca transações por período
   * @param {string} dataInicio - Data inicial (formato ISO)
   * @param {string} dataFim - Data final (formato ISO)
   */
  listarPorPeriodo: async (dataInicio: string, dataFim: string): Promise<TransacaoApi[]> => {
    return transacaoService.listar({
      dataTransacaoGte: dataInicio,
      dataTransacaoLte: dataFim,
      _sort: 'dataTransacao',
      _order: 'desc',
    });
  },

  /**
   * Busca transações recorrentes
   */
  listarRecorrentes: async (): Promise<TransacaoApi[]> => {
    return transacaoService.listar({ recorrente: true, _sort: 'dataTransacao', _order: 'desc' });
  },

  /**
   * Cria uma nova transação
   * @param {object} transacao - Dados da transação
   */
  criar: async (transacao: TransacaoPayload): Promise<TransacaoApi> => {
    const payload = mapPayloadToBackend(transacao);
    const response = await api.post<TransacaoApi>('/transacao', payload);
    return normalizeTransacao(response.data);
  },

  /**
   * Atualiza uma transação parcialmente
   * @param {string} id - UUID da transação
   * @param {object} transacao - Dados atualizados
   */
  atualizar: async (id: string | number, transacao: TransacaoPayload): Promise<TransacaoApi> => {
    const payload = mapPayloadToBackend(transacao);
    const response = await api.patch<TransacaoApi>(`/transacao/${id}`, payload);
    return normalizeTransacao(response.data);
  },

  /**
   * Deleta uma transação
   * @param {string} id - UUID da transação
   */
  deletar: async (id: string | number): Promise<void> => {
    await api.delete(`/transacao/${id}`);
  },

  /**
   * Busca transações com paginação
   * @param {number} pagina - Número da página
   * @param {number} limite - Quantidade por página
   */
  listarComPaginacao: async (pagina = 1, limite = 10): Promise<TransacaoApi[]> => {
    const resultado = await transacaoService.listarPaginado({
      _page: pagina,
      _limit: limite,
      _sort: 'dataTransacao',
      _order: 'desc',
    });

    return resultado.data;
  },
};

export default transacaoService;
