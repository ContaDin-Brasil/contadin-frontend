import api from '../config';
import type { CategoriaApi, CategoriaPayload } from '../types';

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
   * Busca todas as categorias
   */
  listar: async (): Promise<CategoriaApi[]> => {
    const response = await api.get<CategoriaApi[] | EnvelopeArray<CategoriaApi>>('/categorias');
    return toArray<CategoriaApi>(response.data);
  },

  /**
   * Busca categorias por usuário.
   * Retorna categorias globais (fkUsuario: null) + categorias do usuário.
   * @param {string | number} usuarioId - ID do usuário (UUID)
   */
  listarPorUsuario: async (usuarioId: string | number): Promise<CategoriaApi[]> => {
    const response = await api.get<CategoriaApi[] | EnvelopeArray<CategoriaApi>>('/categorias', {
      params: { fkUsuario: usuarioId },
    });
    return toArray<CategoriaApi>(response.data);
  },

  /**
   * Busca uma categoria por ID
   * @param {string} id - UUID da categoria
   */
  buscarPorId: async (id: string): Promise<CategoriaApi> => {
    const response = await api.get<CategoriaApi>(`/categorias/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova categoria
   * @param {object} categoria - Dados da categoria
   */
  criar: async (categoria: CategoriaPayload): Promise<CategoriaApi> => {
    const response = await api.post<CategoriaApi>('/categorias', categoria);
    return response.data;
  },

  /**
   * Atualiza uma categoria parcialmente
   * @param {string} id - UUID da categoria
   * @param {object} categoria - Dados atualizados
   */
  atualizar: async (id: string, categoria: CategoriaPayload): Promise<CategoriaApi> => {
    const response = await api.patch<CategoriaApi>(`/categorias/${id}`, categoria);
    return response.data;
  },

  /**
   * Deleta uma categoria
   * @param {string} id - UUID da categoria
   */
  deletar: async (id: string): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};

export default categoriaService;
