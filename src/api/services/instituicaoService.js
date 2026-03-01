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
   * Deleta uma instituição e TODAS as transações relacionadas
   * @param {number} id - ID da instituição
   */
  deletar: async (id) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🗑️  [DELETE CASCADE] Deletando instituição ID: ${id}`);
    console.log('='.repeat(60));
    
    try {
      // 1. Buscar todas as transações dessa instituição
      const transacoesResponse = await api.get('/transacao', { 
        params: { fk_instituicao: id } 
      });
      const transacoes = transacoesResponse.data;
      
      console.log(`📊 Encontradas ${transacoes.length} transações para deletar`);
      
      // 2. Deletar todas as transações
      for (const transacao of transacoes) {
        console.log(`  ↳ Deletando transação ID ${transacao.id}: ${transacao.descricao}`);
        await api.delete(`/transacao/${transacao.id}`);
      }
      
      // 3. Deletar a instituição
      console.log(`🏦 Deletando instituição ID: ${id}`);
      const response = await api.delete(`/instituicao/${id}`);
      
      console.log(`✅ Instituição e ${transacoes.length} transações deletadas com sucesso!`);
      console.log('='.repeat(60) + '\n');
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao deletar instituição:', error);
      throw error;
    }
  },

  /**
   * Remove transações órfãs (referenciando instituições que não existem mais)
   * @param {number} usuarioId - ID do usuário
   */
  limparTransacoesOrfas: async (usuarioId) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('🧹 [CLEANUP] Limpando transações órfãs');
    console.log('='.repeat(60));
    
    try {
      // 1. Buscar todas as instituições do usuário
      const instituicoesResponse = await api.get('/instituicao', { 
        params: { fk_usuario: usuarioId } 
      });
      const instituicoes = instituicoesResponse.data;
      const idsValidos = instituicoes.map(inst => inst.id);
      
      console.log(`🏦 IDs de instituições válidas: [${idsValidos.join(', ')}]`);
      
      // 2. Buscar todas as transações
      const transacoesResponse = await api.get('/transacao');
      const transacoes = transacoesResponse.data;
      
      // 3. Filtrar transações órfãs
      const transacoesOrfas = transacoes.filter(
        t => !idsValidos.includes(t.fk_instituicao)
      );
      
      console.log(`📊 Encontradas ${transacoesOrfas.length} transações órfãs para deletar:`);
      
      // 4. Deletar transações órfãs
      let deletadas = 0;
      for (const transacao of transacoesOrfas) {
        console.log(`  ↳ Deletando transação ID ${transacao.id}: ${transacao.descricao} (instituição ${transacao.fk_instituicao} não existe)`);
        await api.delete(`/transacao/${transacao.id}`);
        deletadas++;
      }
      
      console.log(`✅ ${deletadas} transações órfãs deletadas com sucesso!`);
      console.log('='.repeat(60) + '\n');
      
      return {
        deletadas,
        transacoesOrfas: transacoesOrfas.map(t => ({
          id: t.id,
          descricao: t.descricao,
          fk_instituicao: t.fk_instituicao
        }))
      };
    } catch (error) {
      console.error('❌ Erro ao limpar transações órfãs:', error);
      throw error;
    }
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
