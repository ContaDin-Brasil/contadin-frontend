import api from '../config';

/**
 * Serviço de Autenticação
 * Gerencia login, logout, recuperação e alteração de senha
 */
const authService = {
  /**
   * Realiza login com email e senha
   * @param {object} credenciais - { email, senha }
   * @returns {Promise<object>} response.data (contém data.token)
   */
  login: async ({ email, senha }) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  /**
   * Realiza logout (token enviado via header no interceptor)
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Solicita recuperação de senha por email
   * @param {object} dados - { email }
   * @returns {Promise<void>} Resposta 204
   */
  recuperarSenha: async ({ email }) => {
    await api.post('/auth/recuperar-senha', { email });
  },

  /**
   * Altera a senha usando token de recuperação
   * @param {object} dados - { token, senha }
   * @returns {Promise<void>} Resposta 204
   */
  alterarSenha: async ({ token, senha }) => {
    await api.post('/auth/alterar-senha', { token, senha });
  },
};

export default authService;
