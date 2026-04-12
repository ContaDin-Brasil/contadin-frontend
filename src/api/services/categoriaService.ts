import api from '../config';
import type { CategoriaApi, CategoriaPayload } from '../types';

/**
 * Serviço de Categorias
 * Gerencia operações relacionadas às categorias de transações
 */
const categoriaService = {
  /**
   * Busca todas as categorias
   */
  listar: async (): Promise<CategoriaApi[]> => {
    const response = await api.get<CategoriaApi[]>('/categorias');
    return response.data;
  },

  /**
   * Busca categorias por usuário
   * Retorna categorias padrão (fk_usuario: null) + categorias do usuário
   * @param {string | number} usuarioId - ID do usuário (UUID)
   */
  listarPorUsuario: async (usuarioId: string | number): Promise<CategoriaApi[]> => {
    try {
      const response = await api.get<CategoriaApi[]>('/categorias', {
        params: { fkUsuario: usuarioId },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
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
