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
   * Busca transações por usuário
   * Nota: Como transações não têm fk_usuario diretamente, 
   * retorna todas as transações (que serão filtradas por instituições do usuário)
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId) => {
    // Por enquanto, retorna todas as transações
    // Em produção, isso seria filtrado pelo backend
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
    console.log('🌐 [API SERVICE] Enviando requisição POST para /transacao');
    console.log('🌐 [API SERVICE] Payload:', JSON.stringify(transacao, null, 2));
    
    try {
      const response = await api.post('/transacao', transacao);
      
      console.log('🌐 [API SERVICE] Status da resposta:', response.status);
      console.log('🌐 [API SERVICE] Dados retornados:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [API SERVICE] Erro na requisição:', error);
      if (error.response) {
        console.error('❌ [API SERVICE] Status do erro:', error.response.status);
        console.error('❌ [API SERVICE] Dados do erro:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
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
