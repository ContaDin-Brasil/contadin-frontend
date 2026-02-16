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
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId) => {
    const response = await api.get('/categoria', { 
      params: { fk_usuario: usuarioId } 
    });
    return response.data;
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
