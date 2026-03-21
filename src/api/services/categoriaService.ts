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
    const response = await api.get<CategoriaApi[]>('/categoria');
    return response.data;
  },

  /**
   * Busca categorias por usuário
   * Retorna categorias padrão (fk_usuario: null) + categorias do usuário
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId: number): Promise<CategoriaApi[]> => {
    try {
      const response = await api.get<CategoriaApi[]>('/categoria');
      const todasCategorias = response.data;

      const categorias = todasCategorias.filter((cat) =>
        cat.fk_usuario === null || cat.fk_usuario === usuarioId
      );

      return categorias;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  /**
   * Busca uma categoria por ID
   * @param {number} id - ID da categoria
   */
  buscarPorId: async (id: number): Promise<CategoriaApi> => {
    const response = await api.get<CategoriaApi>(`/categoria/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova categoria
   * @param {object} categoria - Dados da categoria
   */
  criar: async (categoria: CategoriaPayload): Promise<CategoriaApi> => {
    const response = await api.post<CategoriaApi>('/categoria', categoria);
    return response.data;
  },

  /**
   * Atualiza uma categoria
   * @param {number} id - ID da categoria
   * @param {object} categoria - Dados atualizados
   */
  atualizar: async (id: number, categoria: CategoriaPayload): Promise<CategoriaApi> => {
    const response = await api.put<CategoriaApi>(`/categoria/${id}`, categoria);
    return response.data;
  },

  /**
   * Deleta uma categoria
   * @param {number} id - ID da categoria
   */
  deletar: async (id: number): Promise<CategoriaApi> => {
    const response = await api.delete<CategoriaApi>(`/categoria/${id}`);
    return response.data;
  },
};

export default categoriaService;
