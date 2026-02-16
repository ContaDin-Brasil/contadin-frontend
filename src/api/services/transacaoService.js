import api from '../config';

/**
 * Serviço de Transações
 * Gerencia operações relacionadas a gastos e receitas
 */
const transacaoService = {
  /**
   * Busca todas as transações
   */
  listar: async () => {
    const response = await api.get('/transacao');
    return response.data;
  },

  /**
   * Busca uma transação por ID
   * @param {number} id - ID da transação
   */
  buscarPorId: async (id) => {
    const response = await api.get(`/transacao/${id}`);
    return response.data;
  },

  /**
   * Busca transações por instituição
   * @param {number} instituicaoId - ID da instituição
   */
  listarPorInstituicao: async (instituicaoId) => {
    const response = await api.get('/transacao', { 
      params: { fk_instituicao: instituicaoId } 
    });
    return response.data;
  },

  /**
   * Busca transações por categoria
   * @param {number} categoriaId - ID da categoria
   */
  listarPorCategoria: async (categoriaId) => {
    const response = await api.get('/transacao', { 
      params: { fk_categoria: categoriaId } 
    });
    return response.data;
  },

  /**
   * Busca transações por tipo (GASTO ou RECEITA)
   * @param {string} tipo - Tipo da transação ('GASTO' ou 'RECEITA')
   */
  listarPorTipo: async (tipo) => {
    const response = await api.get('/transacao', { 
      params: { tipo } 
    });
    return response.data;
  },

  /**
   * Busca transações por período
   * @param {string} dataInicio - Data inicial (formato ISO)
   * @param {string} dataFim - Data final (formato ISO)
   */
  listarPorPeriodo: async (dataInicio, dataFim) => {
    const response = await api.get('/transacao', { 
      params: { 
        data_transacao_gte: dataInicio,
        data_transacao_lte: dataFim,
        _sort: 'data_transacao',
        _order: 'desc'
      } 
    });
    return response.data;
  },

  /**
   * Busca transações recorrentes
   */
  listarRecorrentes: async () => {
    const response = await api.get('/transacao', { 
      params: { recorrencia_ne: null } 
    });
    return response.data;
  },

  /**
   * Cria uma nova transação
   * @param {object} transacao - Dados da transação
   */
  criar: async (transacao) => {
    const response = await api.post('/transacao', transacao);
    return response.data;
  },

  /**
   * Atualiza uma transação
   * @param {number} id - ID da transação
   * @param {object} transacao - Dados atualizados
   */
  atualizar: async (id, transacao) => {
    const response = await api.put(`/transacao/${id}`, transacao);
    return response.data;
  },

  /**
   * Deleta uma transação
   * @param {number} id - ID da transação
   */
  deletar: async (id) => {
    const response = await api.delete(`/transacao/${id}`);
    return response.data;
  },

  /**
   * Busca transações com paginação
   * @param {number} pagina - Número da página
   * @param {number} limite - Quantidade por página
   */
  listarComPaginacao: async (pagina = 1, limite = 10) => {
    const response = await api.get('/transacao', { 
      params: { 
        _page: pagina,
        _limit: limite,
        _sort: 'data_transacao',
        _order: 'desc'
      } 
    });
    return response.data;
  },
};

export default transacaoService;
