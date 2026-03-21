import api from '../config';
import type { UsuarioApi, UsuarioParcialPayload, UsuarioPayload } from '../types';

/**
 * Serviço de Usuários
 * Gerencia operações relacionadas aos usuários
 */
const usuarioService = {
  /**
   * Busca todos os usuários
   */
  listar: async (): Promise<UsuarioApi[]> => {
    const response = await api.get<UsuarioApi[]>('/usuario');
    return response.data;
  },

  /**
   * Busca um usuário por ID
   * @param {number} id - ID do usuário
   */
  buscarPorId: async (id: number): Promise<UsuarioApi> => {
    const response = await api.get<UsuarioApi>(`/usuario/${id}`);
    return response.data;
  },

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   */
  buscarPorEmail: async (email: string): Promise<UsuarioApi | undefined> => {
    const response = await api.get<UsuarioApi[]>('/usuario', { params: { email } });
    return response.data[0];
  },

  /**
   * Cria um novo usuário
   * @param {object} usuario - Dados do usuário
   */
  criar: async (usuario: UsuarioPayload): Promise<UsuarioApi> => {
    const response = await api.post<UsuarioApi>('/usuario', usuario);
    return response.data;
  },

  /**
   * Atualiza um usuário
   * @param {number} id - ID do usuário
   * @param {object} usuario - Dados atualizados
   */
  atualizar: async (id: number, usuario: UsuarioPayload): Promise<UsuarioApi> => {
    const response = await api.put<UsuarioApi>(`/usuario/${id}`, usuario);
    return response.data;
  },

  /**
   * Atualiza parcialmente um usuário
   * @param {number} id - ID do usuário
   * @param {object} dadosParciais - Dados parciais para atualizar
   */
  atualizarParcial: async (id: number, dadosParciais: UsuarioParcialPayload): Promise<UsuarioApi> => {
    const response = await api.patch<UsuarioApi>(`/usuario/${id}`, dadosParciais);
    return response.data;
  },

  /**
   * Deleta um usuário
   * @param {number} id - ID do usuário
   */
  deletar: async (id: number): Promise<UsuarioApi> => {
    const response = await api.delete<UsuarioApi>(`/usuario/${id}`);
    return response.data;
  },
};

export default usuarioService;
