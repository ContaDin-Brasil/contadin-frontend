import api from '../config';

/**
 * Serviço de Categorias
 * Gerencia operações relacionadas às categorias de transações
 */
const categoriaService = {
  /**
   * Busca todas as categorias
   */
  listar: async () => {
    const response = await api.get('/categoria');
    return response.data;
  },

  /**
   * Busca categorias por usuário
   * Retorna categorias padrão (fk_usuario: null) + categorias do usuário
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId) => {
    try {
      // Busca todas as categorias
      const response = await api.get('/categoria');
      const todasCategorias = response.data;

      // Filtra: padrão (null) + do usuário
      const categorias = todasCategorias.filter(cat => 
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
  buscarPorId: async (id) => {
    const response = await api.get(`/categoria/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova categoria
   * @param {object} categoria - Dados da categoria
   */
  criar: async (categoria) => {
    const response = await api.post('/categoria', categoria);
    return response.data;
  },

  /**
   * Atualiza uma categoria
   * @param {number} id - ID da categoria
   * @param {object} categoria - Dados atualizados
   */
  atualizar: async (id, categoria) => {
    const response = await api.put(`/categoria/${id}`, categoria);
    return response.data;
  },

  /**
   * Deleta uma categoria
   * @param {number} id - ID da categoria
   */
  deletar: async (id) => {
    const response = await api.delete(`/categoria/${id}`);
    return response.data;
  },
};

export default categoriaService;
