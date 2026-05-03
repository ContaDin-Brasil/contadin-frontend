import api from '../config';
import type { ObjetivoGastoApi, ObjetivoGastoPayload } from '../types';

/**
 * Serviço de Objetivos de Gasto
 * Gerencia operações relacionadas aos objetivos de gastos por categoria
 */
const objetivoGastoService = {
  /**
   * Busca todos os objetivos
   */
  listar: async (): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/meta_gasto');
    return response.data;
  },

  /**
   * Busca objetivos por usuário
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId: number): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/meta_gasto', {
      params: { fk_usuario: usuarioId },
    });
    return response.data;
  },

  /**
   * Busca um objetivo por ID
   * @param {number} id - ID do objetivo
   */
  buscarPorId: async (id: number): Promise<ObjetivoGastoApi> => {
    const response = await api.get<ObjetivoGastoApi>(`/meta_gasto/${id}`);
    return response.data;
  },

  /**
   * Busca objetivo por categoria
   * @param {number} categoriaId - ID da categoria
   */
  buscarPorCategoria: async (categoriaId: number): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/meta_gasto', {
      params: { fk_categoria: categoriaId },
    });
    return response.data;
  },

  /**
   * Busca objetivos ativos (que ainda não expiraram)
   * @param {number} usuarioId - ID do usuário
   * @param {string} dataAtual - Data atual (formato ISO)
   */
  listarAtivas: async (usuarioId: number, dataAtual: string): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/meta_gasto', {
      params: {
        fk_usuario: usuarioId,
        data_fim_meta_gte: dataAtual,
      },
    });
    return response.data;
  },

  /**
   * Cria um novo objetivo
   * @param {object} objetivo - Dados do objetivo
   */
  criar: async (objetivo: ObjetivoGastoPayload): Promise<ObjetivoGastoApi> => {
    const response = await api.post<ObjetivoGastoApi>('/meta_gasto', objetivo);
    return response.data;
  },

  /**
   * Atualiza um objetivo
   * @param {number} id - ID do objetivo
   * @param {object} objetivo - Dados atualizados
   */
  atualizar: async (id: number, objetivo: ObjetivoGastoPayload): Promise<ObjetivoGastoApi> => {
    const response = await api.put<ObjetivoGastoApi>(`/meta_gasto/${id}`, objetivo);
    return response.data;
  },

  /**
   * Deleta um objetivo
   * @param {number} id - ID do objetivo
   */
  deletar: async (id: number): Promise<ObjetivoGastoApi> => {
    const response = await api.delete<ObjetivoGastoApi>(`/meta_gasto/${id}`);
    return response.data;
  },
};

export default objetivoGastoService;
