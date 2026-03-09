// import api from '../config'; // Descomentar quando substituir mocks pela API real.
/**
 * MOCK: Este módulo está em modo mock (dados locais). Substituir as implementações
 * pelos blocos "Como a função ficará depois da migração" em cada método quando o backend estiver pronto.
 */

/**
 * Serviço de Autenticação
 * Gerencia login, logout, recuperação e alteração de senha
 */

// ─────────── Dados mock (apenas para desenvolvimento/teste offline) ───────────
const MOCK_USUARIOS = [
  {
    id: 1,
    nome: "Sysadmin",
    sobrenome: "Silva",
    email: process.env.EXPO_PUBLIC_SYSADMIN_EMAIL || "sysadmin@silva.com",
    senha: process.env.EXPO_PUBLIC_SYSADMIN_PASSWORD || "FarmAura67@",
    tel: "11987654321",
    ativo: true,
  },
];
/** Token fixo aceito em alterarSenha para testar fluxo "esqueci senha" offline. Use este valor na tela de validar token. */
const MOCK_TOKEN_RECUPERACAO_VALIDO = "abc123def456";
// ─────────────────────────────────────────────────────────────────────────────

const authService = {
  /**
   * Realiza login com email e senha
   * @param {object} credenciais - { email, senha }
   * @returns {Promise<object>} response.data (contém data.token)
   */
  login: async ({ email, senha }) => {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pela API real quando o backend estiver pronto
    //
    // REQUEST:
    //   POST /auth/login
    //   Body: { email, senha }
    //   Headers: { 'Content-Type': 'application/json' }
    //
    // RESPONSE esperado (200):
    //   { data: { token [, user ] } }
    //
    // Como a função ficará depois da migração (todo o bloco mock abaixo some):
    //
    //   login: async ({ email, senha }) => {
    //     const response = await api.post('/auth/login', { email, senha });
    //     return response.data;
    //   },
    // ─────────────────────────────────────────────────────────────────

    // MOCK: usando dados locais; substituir pelo bloco acima quando o backend estiver pronto.
    if (email === undefined || email === null || senha === undefined) {
      const err = new Error("email e senha são obrigatórios");
      err.response = { data: { message: "email e senha são obrigatórios" } };
      throw err;
    }
    const emailTrim = String(email).trim();
    const senhaTrim = String(senha).trim();
    if (!emailTrim || senhaTrim === "") {
      const err = new Error("Credenciais inválidas");
      err.response = { data: { message: "Credenciais inválidas" } };
      throw err;
    }
    const usuario = MOCK_USUARIOS.find((u) => u.email === emailTrim);
    if (!usuario || usuario.senha !== senhaTrim) {
      const err = new Error("Credenciais inválidas");
      err.response = { data: { message: "Credenciais inválidas" } };
      throw err;
    }
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const user = { id: usuario.id, nome: usuario.nome, sobrenome: usuario.sobrenome, email: usuario.email };
    return { data: { token, user } };
  },

  /**
   * Realiza logout (token enviado via header no interceptor)
   */
  logout: async () => {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pela API real quando o backend estiver pronto
    //
    // REQUEST:
    //   POST /auth/logout
    //   Headers: { Authorization: 'Bearer <token>' }
    //
    // RESPONSE esperado (204): sem body
    //
    // Como a função ficará depois da migração:
    //
    //   logout: async () => {
    //     const response = await api.post('/auth/logout');
    //     return response.data;
    //   },
    // ─────────────────────────────────────────────────────────────────

    // MOCK: usando dados locais; substituir pelo bloco acima quando o backend estiver pronto.
    return undefined;
  },

  /**
   * Solicita recuperação de senha por email
   * @param {object} dados - { email }
   * @returns {Promise<void>} Resposta 204
   */
  recuperarSenha: async ({ email }) => {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pela API real quando o backend estiver pronto
    //
    // REQUEST:
    //   POST /auth/recuperar-senha
    //   Body: { email }
    //
    // RESPONSE esperado (204): sem body (não revela se o email existe)
    //
    // Como a função ficará depois da migração:
    //
    //   recuperarSenha: async ({ email }) => {
    //     await api.post('/auth/recuperar-senha', { email });
    //   },
    // ─────────────────────────────────────────────────────────────────

    // MOCK: usando dados locais; substituir pelo bloco acima quando o backend estiver pronto.
    if (email === undefined || email === null || String(email).trim() === "") {
      const err = new Error("email é obrigatório");
      err.response = { data: { message: "email é obrigatório" } };
      throw err;
    }
  },

  /**
   * Altera a senha usando token de recuperação
   * @param {object} dados - { token, senha }
   * @returns {Promise<void>} Resposta 204
   */
  alterarSenha: async ({ token, senha }) => {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pela API real quando o backend estiver pronto
    //
    // REQUEST:
    //   POST /auth/alterar-senha
    //   Body: { token, senha }
    //
    // RESPONSE esperado (204): sem body
    // Erros: 400 (token/senha faltando), 401 (token inválido ou expirado)
    //
    // Como a função ficará depois da migração:
    //
    //   alterarSenha: async ({ token, senha }) => {
    //     await api.post('/auth/alterar-senha', { token, senha });
    //   },
    // ─────────────────────────────────────────────────────────────────

    // MOCK: usando dados locais; substituir pelo bloco acima quando o backend estiver pronto.
    if (token === undefined || token === null || String(token).trim() === "") {
      const err = new Error("token e senha são obrigatórios");
      err.response = { data: { message: "token e senha são obrigatórios" } };
      throw err;
    }
    if (senha === undefined || senha === null) {
      const err = new Error("token e senha são obrigatórios");
      err.response = { data: { message: "token e senha são obrigatórios" } };
      throw err;
    }
    const tokenTrim = String(token).trim();
    if (tokenTrim !== MOCK_TOKEN_RECUPERACAO_VALIDO) {
      const err = new Error("Token inválido ou expirado. Solicite um novo código.");
      err.response = { data: { message: "Token inválido ou expirado. Solicite um novo código." }, status: 401 };
      throw err;
    }
  },
};

export default authService;
