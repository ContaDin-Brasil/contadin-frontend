import api from '../config';
import type { RecorrenciaApi, RecorrenciaPayload, RecorrenciaParcialPayload } from '../types';

/**
 * Serviço de Recorrências
 * Gerencia operações relacionadas a transações recorrentes
 */
const recorrenciaService = {
  /**
   * Busca todas as recorrências
   */
  listar: async (): Promise<RecorrenciaApi[]> => {
    const response = await api.get<RecorrenciaApi[]>('/recorrencia');
    return response.data;
  },

  /**
   * Busca recorrências por usuário (apenas ativas)
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId: number): Promise<RecorrenciaApi[]> => {
    const response = await api.get<RecorrenciaApi[]>('/recorrencia', {
      params: { fk_usuario: usuarioId, ativo: true }
    });
    return response.data;
  },

  /**
   * Busca recorrências por usuário (incluindo inativas)
   * @param {number} usuarioId - ID do usuário
   */
  listarTodosPorUsuario: async (usuarioId: number): Promise<RecorrenciaApi[]> => {
    const response = await api.get<RecorrenciaApi[]>('/recorrencia', {
      params: { fk_usuario: usuarioId }
    });
    return response.data;
  },

  /**
   * Busca uma recorrência por ID
   * @param {number} id - ID da recorrência
   */
  buscarPorId: async (id: number): Promise<RecorrenciaApi> => {
    const response = await api.get<RecorrenciaApi>(`/recorrencia/${id}`);
    return response.data;
  },

  /**
   * Busca recorrências por tipo (GASTO ou RECEITA)
   * @param {string} tipo - Tipo da transação ('GASTO' ou 'RECEITA')
   */
  listarPorTipo: async (tipo: 'GASTO' | 'RECEITA'): Promise<RecorrenciaApi[]> => {
    const response = await api.get<RecorrenciaApi[]>('/recorrencia', {
      params: { tipo, ativo: true }
    });
    return response.data;
  },

  /**
   * Busca recorrências por frequência
   * @param {string} frequencia - Frequência ('DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL')
   */
  listarPorFrequencia: async (frequencia: string): Promise<RecorrenciaApi[]> => {
    const response = await api.get<RecorrenciaApi[]>('/recorrencia', {
      params: { frequencia, ativo: true }
    });
    return response.data;
  },

  /**
   * Busca recorrências por categoria
   * @param {number} categoriaId - ID da categoria
   */
  listarPorCategoria: async (categoriaId: number): Promise<RecorrenciaApi[]> => {
    const response = await api.get<RecorrenciaApi[]>('/recorrencia', {
      params: { fk_categoria: categoriaId, ativo: true }
    });
    return response.data;
  },

  /**
   * Cria uma nova recorrência
   * @param {RecorrenciaPayload} payload - Dados da recorrência
   */
  criar: async (payload: RecorrenciaPayload): Promise<RecorrenciaApi> => {
    const response = await api.post<RecorrenciaApi>('/recorrencia', payload);
    return response.data;
  },

  /**
   * Atualiza uma recorrência completa
   * @param {number} id - ID da recorrência
   * @param {RecorrenciaPayload} payload - Novos dados
   */
  atualizar: async (id: number, payload: RecorrenciaPayload): Promise<RecorrenciaApi> => {
    const response = await api.put<RecorrenciaApi>(`/recorrencia/${id}`, payload);
    return response.data;
  },

  /**
   * Atualiza parcialmente uma recorrência
   * @param {number} id - ID da recorrência
   * @param {RecorrenciaParcialPayload} payload - Dados parciais
   */
  atualizarParcial: async (id: number, payload: RecorrenciaParcialPayload): Promise<RecorrenciaApi> => {
    const response = await api.patch<RecorrenciaApi>(`/recorrencia/${id}`, payload);
    return response.data;
  },

  /**
   * Desativa uma recorrência (soft delete)
   * @param {number} id - ID da recorrência
   */
  desativar: async (id: number): Promise<RecorrenciaApi> => {
    const response = await api.patch<RecorrenciaApi>(`/recorrencia/${id}`, { ativo: false });
    return response.data;
  },

  /**
   * Ativa uma recorrência
   * @param {number} id - ID da recorrência
   */
  ativar: async (id: number): Promise<RecorrenciaApi> => {
    const response = await api.patch<RecorrenciaApi>(`/recorrencia/${id}`, { ativo: true });
    return response.data;
  },

  /**
   * Deleta permanentemente uma recorrência
   * @param {number} id - ID da recorrência
   */
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/recorrencia/${id}`);
  },

  /**
   * Incrementa o contador de ocorrências criadas
   * @param {number} id - ID da recorrência
   */
  incrementarOcorrenciasCriadas: async (id: number): Promise<RecorrenciaApi> => {
    const recorrencia = await recorrenciaService.buscarPorId(id);
    return recorrenciaService.atualizarParcial(id, {
      ocorrencias_criadas: (recorrencia.ocorrencias_criadas || 0) + 1
    });
  }
};

export default recorrenciaService;
