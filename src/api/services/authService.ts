import api from '../config';
import type {
  AlterarSenhaPayload,
  CadastroPayload,
  CredenciaisLogin,
  RedefinirSenhaPayload,
  ReenviarPinPayload,
  RecuperarSenhaPayload,
  RespostaLogin,
  UsuarioApi,
  ValidarPinPayload,
} from '../types';

type ApiEnvelope<T> = {
  data?: T;
};

type ApiMensagem = {
  mensagem?: string;
  message?: string;
};

const extrairData = <T>(payload: T | ApiEnvelope<T>): T => {
  const maybeEnvelope = payload as ApiEnvelope<T>;
  return maybeEnvelope?.data !== undefined ? maybeEnvelope.data : (payload as T);
};

type LoginBackendResponse = {
  accessToken?: string;
  token?: string;
  id?: string | number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  ativo?: boolean;
};

const extrairTokenLogin = (payload: LoginBackendResponse): string | null => {
  return payload.accessToken ?? payload.token ?? null;
};

const authService = {
  cadastrar: async (payload: CadastroPayload): Promise<UsuarioApi> => {
    const response = await api.post<UsuarioApi | ApiEnvelope<UsuarioApi>>('/auth/cadastro', {
      nome: payload.nome,
      sobrenome: payload.sobrenome,
      email: payload.email,
      ...(payload.telefone ? { telefone: payload.telefone } : {}),
      senha: payload.senha,
      ...(typeof payload.ativo === 'boolean' ? { ativo: payload.ativo } : {}),
    });

    return extrairData(response.data);
  },

  login: async ({ email, senha }: CredenciaisLogin): Promise<RespostaLogin> => {
    const response = await api.post<LoginBackendResponse | ApiEnvelope<LoginBackendResponse>>('/auth/login', {
      email: String(email).trim(),
      senha: String(senha).trim(),
    });

    const loginData = extrairData(response.data);
    const token = extrairTokenLogin(loginData);
    if (!token) {
      throw new Error('Resposta inválida do servidor: token ausente.');
    }

    return {
      data: {
        token,
        user: loginData.id
          ? {
              id: loginData.id,
              nome: loginData.nome ?? '',
              sobrenome: loginData.sobrenome ?? '',
              email: loginData.email ?? String(email).trim(),
            }
          : undefined,
      },
    };
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  recuperarSenha: async ({ email }: RecuperarSenhaPayload): Promise<ApiMensagem> => {
    const response = await api.post<ApiMensagem>('/auth/esqueceu-senha', {
      email: String(email).trim(),
    });
    return response.data ?? {};
  },

  validarPin: async ({ email, pin }: ValidarPinPayload): Promise<ApiMensagem> => {
    const response = await api.post<ApiMensagem>('/auth/validar-pin', {
      email: String(email).trim(),
      pin: String(pin).trim(),
    });
    return response.data ?? {};
  },

  reenviarPin: async ({ email }: ReenviarPinPayload): Promise<ApiMensagem> => {
    const response = await api.post<ApiMensagem>('/auth/reenviar-pin', {
      email: String(email).trim(),
    });
    return response.data ?? {};
  },

  redefinirSenha: async ({
    email,
    pin,
    novaSenha,
    confirmacaoSenha,
  }: RedefinirSenhaPayload): Promise<ApiMensagem> => {
    const response = await api.post<ApiMensagem>('/auth/redefinir-senha', {
      email: String(email).trim(),
      pin: String(pin).trim(),
      novaSenha,
      confirmacaoSenha,
    });
    return response.data ?? {};
  },

  alterarSenha: async ({
    id,
    senhaAtual,
    novaSenha,
    confirmacaoNovaSenha,
  }: AlterarSenhaPayload): Promise<void> => {
    await api.patch('/auth/senha', {
      id,
      senhaAtual,
      novaSenha,
      confirmacaoNovaSenha,
    });
  },
};

export default authService;
