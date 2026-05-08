import api from '../config';
import type { ObjetivoGastoApi, ObjetivoGastoPayload } from '../types';

type ObjetivosQuery = {
  fkUsuario?: string | number;
  concluido?: boolean;
};

/**
 * Serviço de Objetivos
 * Gerencia operações relacionadas aos objetivos
 */
const objetivoGastoService = {
  /**
   * Busca todos os objetivos
   */
  listar: async (params?: ObjetivosQuery): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/objetivos', { params });
    return response.data;
  },

  /**
   * Busca objetivos por usuário
   * @param {string | number} usuarioId - ID do usuário
   * @param {boolean} concluido - Filtro por concluídos
   */
  listarPorUsuario: async (
    usuarioId: string | number,
    concluido?: boolean,
  ): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/objetivos', {
      params: { fkUsuario: usuarioId, ...(concluido !== undefined ? { concluido } : {}) },
    });
    return response.data;
  },

  /**
   * Busca objetivos por nome
   * @param {string} nome - Nome para busca
   * @param {string | number} usuarioId - ID do usuário
   * @param {boolean} concluido - Filtro por concluídos
   */
  buscarPorNome: async (
    nome: string,
    usuarioId: string | number,
    concluido?: boolean,
  ): Promise<ObjetivoGastoApi[]> => {
    const response = await api.get<ObjetivoGastoApi[]>('/objetivos/nome', {
      params: { nome, fkUsuario: usuarioId, ...(concluido !== undefined ? { concluido } : {}) },
    });
    return response.data;
  },

  /**
   * Busca um objetivo por ID
   * @param {string | number} id - ID do objetivo
   */
  buscarPorId: async (id: string | number): Promise<ObjetivoGastoApi> => {
    const response = await api.get<ObjetivoGastoApi>(`/objetivos/${id}`);
    return response.data;
  },

  /**
   * Cria um novo objetivo
   * @param {object} objetivo - Dados do objetivo
   */
  criar: async (objetivo: ObjetivoGastoPayload): Promise<ObjetivoGastoApi> => {
    const response = await api.post<ObjetivoGastoApi>('/objetivos', objetivo);
    return response.data;
  },

  /**
   * Atualiza parcialmente um objetivo
   * @param {string | number} id - ID do objetivo
   * @param {object} objetivo - Dados atualizados
   */
  atualizar: async (
    id: string | number,
    objetivo: Partial<ObjetivoGastoPayload>,
  ): Promise<ObjetivoGastoApi> => {
    const response = await api.patch<ObjetivoGastoApi>(`/objetivos/${id}`, objetivo);
    return response.data;
  },

  /**
   * Deleta um objetivo
   * @param {string | number} id - ID do objetivo
   */
  deletar: async (id: string | number): Promise<void> => {
    await api.delete(`/objetivos/${id}`);
  },
};

export default objetivoGastoService;
