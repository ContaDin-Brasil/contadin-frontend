import api from '../config';
import type {
  CategoriaApi,
  CategoriaAtualizacaoPayload,
  CategoriaPayload,
} from '../types';
import type { CategoryType } from '../../telas/categorias/types/categoria.types';

type ApiEnvelope<T> = {
  data?: T;
};

const extrairData = <T>(payload: T | ApiEnvelope<T>): T => {
  const maybeEnvelope = payload as ApiEnvelope<T>;
  return maybeEnvelope?.data !== undefined ? maybeEnvelope.data : (payload as T);
};

const paraChave = (value: unknown): string => String(value ?? '').trim();

const categoriaPertenceAoUsuarioOuSistema = (
  categoria: CategoriaApi,
  usuarioId: string | number,
): boolean => {
  const fkCategoria = categoria.fkUsuario ?? categoria.fk_usuario ?? null;

  if (fkCategoria === null || fkCategoria === undefined) {
    return true;
  }

  return paraChave(fkCategoria) === paraChave(usuarioId);
};

const mapearCategoriaApi = (categoria: any): CategoriaApi => {
  const fkUsuario = categoria?.fkUsuario ?? categoria?.fk_usuario ?? null;

  return {
    id: categoria.id,
    nome: categoria.nome,
    icone: categoria.icone,
    cor: categoria.cor,
    tipo: categoria.tipo,
    fkUsuario,
    fk_usuario: fkUsuario,
    ativo: categoria.ativo,
    criadoEm: categoria.criadoEm,
    atualizadoEm: categoria.atualizadoEm,
  };
};

const mapearListaCategorias = (payload: unknown): CategoriaApi[] => {
  const data = extrairData(payload as CategoriaApi[] | ApiEnvelope<CategoriaApi[]>);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(mapearCategoriaApi);
};

const normalizarFkUsuario = (payload: {
  fkUsuario?: string | number;
  fk_usuario?: string | number;
}): string | number | undefined => {
  const value = payload.fkUsuario ?? payload.fk_usuario;
  const key = paraChave(value);
  return key === '' ? undefined : (value as string | number);
};

const mapearPayloadCriacao = (categoria: CategoriaPayload): Record<string, unknown> => {
  const fkUsuario = normalizarFkUsuario(categoria);
  if (fkUsuario === undefined) {
    throw new Error('Usuario invalido para criacao de categoria.');
  }

  return {
    nome: categoria.nome,
    icone: categoria.icone,
    cor: categoria.cor,
    tipo: categoria.tipo,
    fkUsuario,
  };
};

const mapearPayloadAtualizacao = (
  categoria: CategoriaAtualizacaoPayload,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  if (categoria.nome !== undefined) payload.nome = categoria.nome;
  if (categoria.icone !== undefined) payload.icone = categoria.icone;
  if (categoria.cor !== undefined) payload.cor = categoria.cor;
  if (categoria.tipo !== undefined) payload.tipo = categoria.tipo;

  const fkUsuario = normalizarFkUsuario(categoria);
  if (fkUsuario !== undefined) payload.fkUsuario = fkUsuario;

  return payload;
};

type EnvelopeArray<T> = {
  data?: T[];
  content?: T[];
  items?: T[];
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
  }

  return [];
};

/**
 * Serviço de Categorias
 * Gerencia operações relacionadas às categorias de transações
 */
const categoriaService = {
  /**
   * Busca categorias com filtros opcionais
   */
  listar: async (params?: {
    fkUsuario?: string | number;
    tipoCategoria?: CategoryType;
  }): Promise<CategoriaApi[]> => {
    const response = await api.get<CategoriaApi[] | ApiEnvelope<CategoriaApi[]> | EnvelopeArray<CategoriaApi>>('/categorias', {
      params,
    });
    const categorias = Array.isArray(response.data)
      ? mapearListaCategorias(response.data)
      : toArray<CategoriaApi>(response.data).map(mapearCategoriaApi);

    return categorias;
  },

  /**
   * Busca categorias por usuário
   * @param {string | number} usuarioId - ID do usuário
   * @param {CategoryType} tipoCategoria - Tipo da categoria
   */
  listarPorUsuario: async (
    usuarioId: string | number,
    tipoCategoria?: CategoryType,
  ): Promise<CategoriaApi[]> => {
    const response = await api.get<CategoriaApi[] | ApiEnvelope<CategoriaApi[]> | EnvelopeArray<CategoriaApi>>('/categorias', {
      params: {
        fkUsuario: usuarioId,
        ...(tipoCategoria ? { tipoCategoria } : {}),
      },
    });

    const categorias = Array.isArray(response.data)
      ? mapearListaCategorias(response.data)
      : toArray<CategoriaApi>(response.data).map(mapearCategoriaApi);

    return categorias.filter((categoria) =>
      categoriaPertenceAoUsuarioOuSistema(categoria, usuarioId),
    );
  },

  /**
   * Busca todas as categorias por usuário para fluxo de importação ETL.
   * Backend esperado: GET /categorias/all/{usuarioId}
   */
  listarTodasPorUsuarioImportacao: async (
    usuarioId: string | number,
  ): Promise<CategoriaApi[]> => {
    const response = await api.get<
      CategoriaApi[] | ApiEnvelope<CategoriaApi[]> | EnvelopeArray<CategoriaApi>
    >(`/categorias/all?fkUsuario=${usuarioId}`);

    const categorias = Array.isArray(response.data)
      ? mapearListaCategorias(response.data)
      : toArray<CategoriaApi>(response.data).map(mapearCategoriaApi);

    return categorias.filter((categoria) =>
      categoriaPertenceAoUsuarioOuSistema(categoria, usuarioId),
    );
  },

  /**
   * Busca categorias por nome filtrando por usuário
   */
  buscarPorNome: async (
    nome: string,
    usuarioId: string | number,
    tipoCategoria?: CategoryType,
  ): Promise<CategoriaApi[]> => {
    const response = await api.get<CategoriaApi[] | ApiEnvelope<CategoriaApi[]> | EnvelopeArray<CategoriaApi>>('/categorias/nome', {
      params: {
        nome,
        fkUsuario: usuarioId,
        ...(tipoCategoria ? { tipoCategoria } : {}),
      },
    });

    const categorias = Array.isArray(response.data)
      ? mapearListaCategorias(response.data)
      : toArray<CategoriaApi>(response.data).map(mapearCategoriaApi);

    return categorias.filter((categoria) =>
      categoriaPertenceAoUsuarioOuSistema(categoria, usuarioId),
    );
  },

  /**
   * Busca uma categoria por ID
   * @param {string | number} id - ID da categoria
   */
  buscarPorId: async (id: string | number): Promise<CategoriaApi> => {
    const response = await api.get<CategoriaApi | ApiEnvelope<CategoriaApi>>(`/categorias/${id}`);
    return mapearCategoriaApi(extrairData(response.data));
  },

  /**
   * Cria uma nova categoria
   * @param {object} categoria - Dados da categoria
   */
  criar: async (categoria: CategoriaPayload): Promise<CategoriaApi> => {
    const response = await api.post<CategoriaApi | ApiEnvelope<CategoriaApi>>(
      '/categorias',
      mapearPayloadCriacao(categoria),
    );
    return mapearCategoriaApi(extrairData(response.data));
  },

  /**
   * Atualiza parcialmente uma categoria
   * @param {string | number} id - ID da categoria
   * @param {object} categoria - Dados atualizados
   */
  atualizar: async (
    id: string | number,
    categoria: CategoriaAtualizacaoPayload,
  ): Promise<CategoriaApi> => {
    const response = await api.patch<CategoriaApi | ApiEnvelope<CategoriaApi>>(
      `/categorias/${id}`,
      mapearPayloadAtualizacao(categoria),
    );
    return mapearCategoriaApi(extrairData(response.data));
  },

  /**
   * Alterna status lógico de uma categoria
   * @param {string | number} id - ID da categoria
   */
  alternarStatus: async (id: string | number): Promise<void> => {
    await api.patch(`/categorias/${id}/alternar-status`);
  },

  /**
   * Mantido por compatibilidade com chamadas antigas de UI.
   */
  deletar: async (id: string | number): Promise<void> => {
    await categoriaService.alternarStatus(id);
  },
};

export default categoriaService;
