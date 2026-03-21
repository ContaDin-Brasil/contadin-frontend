import type {
  AlterarSenhaPayload,
  CredenciaisLogin,
  RecuperarSenhaPayload,
  RespostaLogin,
  UsuarioApi,
} from '../types';

type ErroComResposta = Error & {
  response: {
    data: { message: string };
    status?: number;
  };
};

interface UsuarioMock extends UsuarioApi {
  senha: string;
}

const criarErroAuth = (message: string, status?: number): ErroComResposta => {
  const error = new Error(message) as ErroComResposta;
  error.response = {
    data: { message },
    ...(status ? { status } : {}),
  };
  return error;
};

const MOCK_USUARIOS: UsuarioMock[] = [
  {
    id: 1,
    nome: 'Sysadmin',
    sobrenome: 'Silva',
    email: process.env.EXPO_PUBLIC_SYSADMIN_EMAIL || 'sysadmin@silva.com',
    senha: process.env.EXPO_PUBLIC_SYSADMIN_PASSWORD || 'FarmAura67@',
    tel: '11987654321',
    ativo: true,
  },
];

const MOCK_TOKEN_RECUPERACAO_VALIDO = 'abc123def456';

const authService = {
  login: async ({ email, senha }: CredenciaisLogin): Promise<RespostaLogin> => {
    if (email === undefined || email === null || senha === undefined) {
      throw criarErroAuth('email e senha são obrigatórios');
    }

    const emailTrim = String(email).trim();
    const senhaTrim = String(senha).trim();

    if (!emailTrim || senhaTrim === '') {
      throw criarErroAuth('Credenciais inválidas');
    }

    const usuario = MOCK_USUARIOS.find((item) => item.email === emailTrim);

    if (!usuario || usuario.senha !== senhaTrim) {
      throw criarErroAuth('Credenciais inválidas');
    }

    const token = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
      data: {
        token,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
        },
      },
    };
  },

  logout: async (): Promise<void> => {
    return undefined;
  },

  recuperarSenha: async ({ email }: RecuperarSenhaPayload): Promise<void> => {
    if (email === undefined || email === null || String(email).trim() === '') {
      throw criarErroAuth('email é obrigatório');
    }
  },

  alterarSenha: async ({ token, senha }: AlterarSenhaPayload): Promise<void> => {
    if (token === undefined || token === null || String(token).trim() === '') {
      throw criarErroAuth('token e senha são obrigatórios');
    }

    if (senha === undefined || senha === null) {
      throw criarErroAuth('token e senha são obrigatórios');
    }

    const tokenTrim = String(token).trim();

    if (tokenTrim !== MOCK_TOKEN_RECUPERACAO_VALIDO) {
      throw criarErroAuth('Token inválido ou expirado. Solicite um novo código.', 401);
    }
  },
};

export default authService;
