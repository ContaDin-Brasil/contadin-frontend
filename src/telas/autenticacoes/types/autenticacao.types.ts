/**
 * Tipos e interfaces para o módulo de autenticação
 */

export interface CredenciaisLogin {
  email: string;
  senha: string;
}

export interface RespostaLogin {
  data: {
    token: string;
    user: object;
  };
}

export interface DadosRecuperacao {
  email: string;
}

export interface DadosAlterarSenhaRecuperacao {
  token: string;
  senha: string;
}
