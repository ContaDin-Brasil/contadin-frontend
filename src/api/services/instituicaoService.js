import api from '../config';

/**
 * Serviço de Instituições
 * Gerencia operações relacionadas a bancos, vales e carteiras
 */
const instituicaoService = {
  /**
   * Busca todas as instituições
   */
  listar: async () => {
    const response = await api.get('/instituicao');
    return response.data;
  },

  /**
   * Busca instituições por usuário
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId) => {
    const response = await api.get('/instituicao', { 
      params: { fk_usuario: usuarioId } 
    });
    return response.data;
  },

  /**
   * Busca uma instituição por ID
   * @param {number} id - ID da instituição
   */
  buscarPorId: async (id) => {
    const response = await api.get(`/instituicao/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova instituição
   * @param {object} instituicao - Dados da instituição
   */
  criar: async (instituicao) => {
    const response = await api.post('/instituicao', instituicao);
    return response.data;
  },

  /**
   * Atualiza uma instituição
   * @param {number} id - ID da instituição
   * @param {object} instituicao - Dados atualizados
   */
  atualizar: async (id, instituicao) => {
    const response = await api.put(`/instituicao/${id}`, instituicao);
    return response.data;
  },

  /**
   * Deleta uma instituição
   * @param {number} id - ID da instituição
   */
  deletar: async (id) => {
    const response = await api.delete(`/instituicao/${id}`);
    return response.data;
  },

  /**
   * Busca instituições com suas transações
   * @param {number} usuarioId - ID do usuário
   */
  listarComTransacoes: async (usuarioId) => {
    const response = await api.get('/instituicao', { 
      params: { 
        fk_usuario: usuarioId,
        _embed: 'transacao'
      } 
    });
    return response.data;
  },
};

export default instituicaoService;
