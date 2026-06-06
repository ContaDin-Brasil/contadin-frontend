import api from '../config';
import type { TransactionType } from '../../telas/transacoes/types/transacao.types';
import { normalizarId } from '../../utils/normalizacao';

type AnyRecord = Record<string, unknown>;

type EnvelopeArray<T> = {
  data?: T[];
  content?: T[];
  items?: T[];
  transacoes?: T[];
};

export interface ArquivoPlanilha {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
  webFile?: unknown;
}

export interface TransacaoImportada {
  localId: string;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  dataTransacao: string;
  fkInstituicao: string | number | null;
  fkCategoria: string | number | null;
  instituicaoNome?: string;
  categoriaNome?: string;
  selecionada: boolean;
  linhaOrigem?: number | null;
  observacao?: string;
}

const DEFAULT_IMPORT_PATH = '/data/process';

const normalizeEnvUrl = (value?: string): string | null => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const unquoted = trimmed.replace(/^['\"]|['\"]$/g, '').trim();
  return unquoted || null;
};

const normalizePath = (value: string | undefined): string => {
  if (!value) {
    return DEFAULT_IMPORT_PATH;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_IMPORT_PATH;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const importPath = normalizePath(process.env.EXPO_PUBLIC_ETL_IMPORT_PATH);
const etlBaseUrl = normalizeEnvUrl(process.env.EXPO_PUBLIC_PYTHON_BASE_URL);
const sendAuthToEtl = process.env.EXPO_PUBLIC_ETL_SEND_AUTH === 'true';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const buildImportUrl = (): string => {
  const baseUrl = etlBaseUrl ?? api.defaults.baseURL;
  if (!baseUrl) {
    throw new Error('Base URL do ETL/API nao configurada');
  }

  const normalizedBase = trimTrailingSlash(baseUrl);
  const normalizedPath = importPath.startsWith('/') ? importPath : `/${importPath}`;
  return `${normalizedBase}${normalizedPath}`;
};

const getString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return fallback;
};

const getNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const getId = (value: unknown): string | number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }

  return null;
};

const cleanPayload = (payload: Record<string, unknown>): Record<string, unknown> => {
  const entries = Object.entries(payload).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  });

  return Object.fromEntries(entries);
};

const normalizeTipo = (value: unknown): TransactionType => {
  const raw = getString(value).toUpperCase();
  return raw === 'RECEITA' ? 'RECEITA' : 'GASTO';
};

const toArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const source = payload as EnvelopeArray<T>;
    if (Array.isArray(source.data)) return source.data;
    if (Array.isArray(source.content)) return source.content;
    if (Array.isArray(source.items)) return source.items;
    if (Array.isArray(source.transacoes)) return source.transacoes;
  }

  return [];
};

const normalizeData = (value: unknown): string => {
  const raw = getString(value).trim();

  try {
    // Tenta parsear como ISO primeiro
    if (raw.includes('T')) {
      const date = new Date(raw);
      if (!isNaN(date.getTime())) {
        // Retorna ISO válido sem milissegundos: YYYY-MM-DDTHH:MM:SS
        const iso = date.toISOString();
        return iso.split('.')[0]; // Remove milissegundos
      }
    }

    // Tenta parsear como DD/MM/YYYY
    const slashParts = raw.split('/');
    if (slashParts.length === 3) {
      const [day, month, year] = slashParts;
      if (day && month && year) {
        const dateObj = new Date(`${year}-${month}-${day}`);
        if (!isNaN(dateObj.getTime())) {
          return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
        }
      }
    }

    // Tenta parsear como YYYY-MM-DD
    const dashParts = raw.split('-');
    if (dashParts.length === 3) {
      const [year, month, day] = dashParts;
      if (year && month && day) {
        const dateObj = new Date(`${year}-${month}-${day}`);
        if (!isNaN(dateObj.getTime())) {
          return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao normalizar data:', raw, e);
  }

  // Fallback: data de hoje em formato válido
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00`;
};

const normalizeItem = (item: unknown, index: number): TransacaoImportada => {
  const source = (item && typeof item === 'object' ? item : {}) as AnyRecord;

  return {
    localId: getString(source.localId ?? source.id, `etl-${index}`),
    descricao: getString(source.descricao ?? source.historico ?? source.memo),
    valor: getNumber(source.valor ?? source.amount, 0),
    tipo: normalizeTipo(source.tipo ?? source.type),
    dataTransacao: normalizeData(source.dataTransacao ?? source.data_transacao ?? source.data ?? source.date),
    fkInstituicao: getId(source.fkInstituicao ?? source.instituicaoId ?? source.fk_instituicao),
    fkCategoria: getId(source.fkCategoria ?? source.categoriaId ?? source.fk_categoria),
    instituicaoNome: getString(source.instituicao ?? source.institution, ''),
    categoriaNome: getString(source.categoria ?? source.category, ''),
    selecionada: true,
    linhaOrigem: getNumber(source.linhaOrigem ?? source.row, 0) || null,
    observacao: getString(source.observacao ?? source.note),
  };
};

const toBackendPayload = (item: TransacaoImportada): Record<string, unknown> => {
  // Segue o mesmo padrão do serviço de transações: ids normalizados e campos nulos removidos
  return cleanPayload({
    descricao: item.descricao?.trim() || '',
    valor: getNumber(item.valor, 0),
    tipo: item.tipo,
    dataTransacao: normalizeData(item.dataTransacao),
    parcelado: false,
    recorrencia: null,
    fimRecorrencia: null,
    ativo: true,
    fkInstituicao: normalizarId(item.fkInstituicao),
    fkCategoria: normalizarId(item.fkCategoria),
  });
};

const getAuthHeaders = (token?: string): Record<string, string> => {
  if (!token?.trim()) {
    return {};
  }

  return {
    Authorization: `Bearer ${token.trim()}`,
  };
};

const importacaoPlanilhaService = {
  importarArquivo: async (
    arquivo: ArquivoPlanilha,
    token?: string,
  ): Promise<TransacaoImportada[]> => {
    const formData = new FormData();

    if (arquivo.webFile) {
      formData.append('file', arquivo.webFile as any, arquivo.name);
    } else {
      formData.append('file', {
        uri: arquivo.uri,
        name: arquivo.name,
        type: arquivo.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      } as any);
    }

    const etlAuthHeaders = sendAuthToEtl ? getAuthHeaders(token) : {};
    const uploadUrl = buildImportUrl();

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        ...etlAuthHeaders,
      },
    });

    if (!response.ok) {
      let detail: unknown = null;
      try {
        detail = await response.json();
      } catch {
        detail = await response.text();
      }

      console.error('Erro no upload da planilha:', {
        status: response.status,
        detail,
      });

      const serverMessage =
        detail && typeof detail === 'object' && 'message' in (detail as object)
          ? String((detail as Record<string, unknown>).message)
          : null;

      throw new Error(
        serverMessage ?? `Falha ao importar planilha (status ${response.status})`,
      );
    }

    const payload = await response.json();
    const list = toArray<unknown>(payload);
    return list.map((item, index) => normalizeItem(item, index));
  },

  confirmarTransacoes: async (
    transacoes: TransacaoImportada[],
    token?: string,
  ): Promise<{ criadas: number; falhas: number }> => {
    const selecionadas = transacoes.filter((item) => item.selecionada);

    if (selecionadas.length === 0) {
      return { criadas: 0, falhas: 0 };
    }

    const results = await Promise.allSettled(
      selecionadas.map((item) => {
        const payload = toBackendPayload(item);
        console.log('Enviando para backend:', JSON.stringify(payload, null, 2));
        
        return api.post('/transacao', payload, {
          headers: getAuthHeaders(token),
        }).catch((error) => {
          console.error('Erro ao criar transação:', {
            payload,
            status: error?.response?.status,
            message: error?.response?.data?.message,
            error: error?.response?.data,
          });
          throw error;
        });
      }),
    );

    const criadas = results.filter((result) => result.status === 'fulfilled').length;
    const falhas = results.length - criadas;

    return { criadas, falhas };
  },
};

export default importacaoPlanilhaService;
