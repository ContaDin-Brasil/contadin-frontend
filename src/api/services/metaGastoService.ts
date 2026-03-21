import api from '../config';
import type { MetaGastoApi, MetaGastoPayload } from '../types';

/**
 * Serviço de Metas de Gasto
 * Gerencia operações relacionadas às metas de gastos por categoria
 */
const metaGastoService = {
  /**
   * Busca todas as metas
   */
  listar: async (): Promise<MetaGastoApi[]> => {
    const response = await api.get<MetaGastoApi[]>('/meta_gasto');
    return response.data;
  },

  /**
   * Busca metas por usuário
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId: number): Promise<MetaGastoApi[]> => {
    const response = await api.get<MetaGastoApi[]>('/meta_gasto', {
      params: { fk_usuario: usuarioId } 
    });
    return response.data;
  },

  /**
   * Busca uma meta por ID
   * @param {number} id - ID da meta
   */
  buscarPorId: async (id: number): Promise<MetaGastoApi> => {
    const response = await api.get<MetaGastoApi>(`/meta_gasto/${id}`);
    return response.data;
  },

  /**
   * Busca meta por categoria
   * @param {number} categoriaId - ID da categoria
   */
  buscarPorCategoria: async (categoriaId: number): Promise<MetaGastoApi[]> => {
    const response = await api.get<MetaGastoApi[]>('/meta_gasto', {
      params: { fk_categoria: categoriaId } 
    });
    return response.data;
  },

  /**
   * Busca metas ativas (que ainda não expiraram)
   * @param {number} usuarioId - ID do usuário
   * @param {string} dataAtual - Data atual (formato ISO)
   */
  listarAtivas: async (usuarioId: number, dataAtual: string): Promise<MetaGastoApi[]> => {
    const response = await api.get<MetaGastoApi[]>('/meta_gasto', {
      params: { 
        fk_usuario: usuarioId,
        data_fim_meta_gte: dataAtual
      } 
    });
    return response.data;
  },

  /**
   * Cria uma nova meta
   * @param {object} meta - Dados da meta
   */
  criar: async (meta: MetaGastoPayload): Promise<MetaGastoApi> => {
    const response = await api.post<MetaGastoApi>('/meta_gasto', meta);
    return response.data;
  },

  /**
   * Atualiza uma meta
   * @param {number} id - ID da meta
   * @param {object} meta - Dados atualizados
   */
  atualizar: async (id: number, meta: MetaGastoPayload): Promise<MetaGastoApi> => {
    const response = await api.put<MetaGastoApi>(`/meta_gasto/${id}`, meta);
    return response.data;
  },

  /**
   * Deleta uma meta
   * @param {number} id - ID da meta
   */
  deletar: async (id: number): Promise<MetaGastoApi> => {
    const response = await api.delete<MetaGastoApi>(`/meta_gasto/${id}`);
    return response.data;
  },
};

export default metaGastoService;
