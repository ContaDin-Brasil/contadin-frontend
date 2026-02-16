import api from '../config';

/**
 * Serviço de Usuários
 * Gerencia operações relacionadas aos usuários
 */
const usuarioService = {
  /**
   * Busca todos os usuários
   */
  listar: async () => {
    const response = await api.get('/usuario');
    return response.data;
  },

  /**
   * Busca um usuário por ID
   * @param {number} id - ID do usuário
   */
  buscarPorId: async (id) => {
    const response = await api.get(`/usuario/${id}`);
    return response.data;
  },

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   */
  buscarPorEmail: async (email) => {
    const response = await api.get('/usuario', { params: { email } });
    return response.data[0];
  },

  /**
   * Cria um novo usuário
   * @param {object} usuario - Dados do usuário
   */
  criar: async (usuario) => {
    const response = await api.post('/usuario', usuario);
    return response.data;
  },

  /**
   * Atualiza um usuário
   * @param {number} id - ID do usuário
   * @param {object} usuario - Dados atualizados
   */
  atualizar: async (id, usuario) => {
    const response = await api.put(`/usuario/${id}`, usuario);
    return response.data;
  },

  /**
   * Atualiza parcialmente um usuário
   * @param {number} id - ID do usuário
   * @param {object} dadosParciais - Dados parciais para atualizar
   */
  atualizarParcial: async (id, dadosParciais) => {
    const response = await api.patch(`/usuario/${id}`, dadosParciais);
    return response.data;
  },

  /**
   * Deleta um usuário
   * @param {number} id - ID do usuário
   */
  deletar: async (id) => {
    const response = await api.delete(`/usuario/${id}`);
    return response.data;
  },
};

export default usuarioService;
