import api from '../config';
import type { UsuarioApi, UsuarioParcialPayload, UsuarioPayload } from '../types';

type ApiEnvelope<T> = {
  data?: T;
};

const extrairData = <T>(payload: T | ApiEnvelope<T>): T => {
  const maybeEnvelope = payload as ApiEnvelope<T>;
  return maybeEnvelope?.data !== undefined ? maybeEnvelope.data : (payload as T);
};

const mapearUsuarioApi = (usuario: UsuarioApi): UsuarioApi => {
  return {
    ...usuario,
    telefone: usuario.telefone,
  };
};

const mapearUsuarioPayload = (usuario: UsuarioPayload): Record<string, unknown> => {
  return {
    nome: usuario.nome,
    sobrenome: usuario.sobrenome,
    email: usuario.email,
    ...(usuario.telefone ? { telefone: usuario.telefone } : {}),
    ...(usuario.senha ? { senha: usuario.senha } : {}),
    ...(typeof usuario.ativo === 'boolean' ? { ativo: usuario.ativo } : {}),
  };
};

const mapearUsuarioParcialPayload = (
  usuario: UsuarioParcialPayload,
): Record<string, unknown> => {
  return {
    ...(usuario.nome !== undefined ? { nome: usuario.nome } : {}),
    ...(usuario.sobrenome !== undefined ? { sobrenome: usuario.sobrenome } : {}),
    ...(usuario.email !== undefined ? { email: usuario.email } : {}),
    ...(usuario.telefone !== undefined ? { telefone: usuario.telefone } : {}),
    ...(usuario.senha !== undefined ? { senha: usuario.senha } : {}),
    ...(usuario.ativo !== undefined ? { ativo: usuario.ativo } : {}),
  };
};

/**
 * Serviço de Usuários
 * Gerencia operações relacionadas aos usuários
 */
const usuarioService = {
  /**
   * Busca todos os usuários
   */
  listar: async (): Promise<UsuarioApi[]> => {
    const response = await api.get<UsuarioApi[] | ApiEnvelope<UsuarioApi[]>>('/usuarios');
    const usuarios = extrairData(response.data);
    return usuarios.map(mapearUsuarioApi);
  },

  /**
   * Busca um usuário por ID
   * @param {number} id - ID do usuário
   */
  buscarPorId: async (id: string | number): Promise<UsuarioApi> => {
    const response = await api.get<UsuarioApi | ApiEnvelope<UsuarioApi>>(`/usuarios/${id}`);
    return mapearUsuarioApi(extrairData(response.data));
  },

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   */
  buscarPorEmail: async (email: string): Promise<UsuarioApi | undefined> => {
    const response = await api.get<UsuarioApi[] | ApiEnvelope<UsuarioApi[]>>('/usuarios', {
      params: { email },
    });
    const usuarios = extrairData(response.data);
    return usuarios.length > 0 ? mapearUsuarioApi(usuarios[0]) : undefined;
  },

  /**
   * Cria um novo usuário
   * @param {object} usuario - Dados do usuário
   */
  criar: async (usuario: UsuarioPayload): Promise<UsuarioApi> => {
    const response = await api.post<UsuarioApi | ApiEnvelope<UsuarioApi>>(
      '/usuarios',
      mapearUsuarioPayload(usuario),
    );
    return mapearUsuarioApi(extrairData(response.data));
  },

  /**
   * Atualiza um usuário
   * @param {number} id - ID do usuário
   * @param {object} usuario - Dados atualizados
   */
  atualizar: async (id: string | number, usuario: UsuarioPayload): Promise<UsuarioApi> => {
    const response = await api.put<UsuarioApi | ApiEnvelope<UsuarioApi>>(
      `/usuarios/${id}`,
      mapearUsuarioPayload(usuario),
    );
    return mapearUsuarioApi(extrairData(response.data));
  },

  /**
   * Atualiza parcialmente um usuário
   * @param {number} id - ID do usuário
   * @param {object} dadosParciais - Dados parciais para atualizar
   */
  atualizarParcial: async (
    id: string | number,
    dadosParciais: UsuarioParcialPayload,
  ): Promise<UsuarioApi> => {
    const response = await api.patch<UsuarioApi | ApiEnvelope<UsuarioApi>>(
      `/usuarios/${id}`,
      mapearUsuarioParcialPayload(dadosParciais),
    );
    return mapearUsuarioApi(extrairData(response.data));
  },

  /**
   * Atualiza dados cadastrais do usuário
   * Endpoint: PATCH /usuarios/{id}
   */
  atualizarCadastro: async (
    id: string | number,
    dadosParciais: UsuarioParcialPayload,
  ): Promise<UsuarioApi> => {
    const response = await api.patch<UsuarioApi | ApiEnvelope<UsuarioApi>>(
      `/usuarios/${id}`,
      mapearUsuarioParcialPayload(dadosParciais),
    );
    return mapearUsuarioApi(extrairData(response.data));
  },

  /**
   * Desativa usuário (soft delete)
   * Endpoint: PATCH /usuarios/{id}/desativar
   */
  desativar: async (id: string | number): Promise<void> => {
    await api.patch(`/usuarios/${id}/desativar`);
  },

  /**
   * Deleta um usuário
   * @param {number} id - ID do usuário
   */
  deletar: async (id: string | number): Promise<UsuarioApi> => {
    const response = await api.delete<UsuarioApi | ApiEnvelope<UsuarioApi>>(`/usuarios/${id}`);
    return mapearUsuarioApi(extrairData(response.data));
  },
};

export default usuarioService;
