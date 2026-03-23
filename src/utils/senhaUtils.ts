import { REQUISITOS_SENHA } from '../telas/configuracoes/constants/constantesConfiguracao';

export interface ResultadoValidacaoSenha {
  msg: string;
  valido: boolean;
}

const VALIDADORES_SENHA = [
  (senha: string) => senha.length >= 8,
  (senha: string) => /\d/.test(senha),
  (senha: string) => /[!@$%&_]/.test(senha),
  (senha: string) => !/(123|234|345|456|567|678|789|321|432|543|654|765|876|987)/.test(senha),
  (senha: string) => !/(\d)\1{2}/.test(senha),
];

export const obterResultadosValidacaoSenha = (
  senha: string,
  requisitos: string[] = REQUISITOS_SENHA,
): ResultadoValidacaoSenha[] => {
  return requisitos.map((msg, index) => ({
    msg,
    valido: VALIDADORES_SENHA[index] ? VALIDADORES_SENHA[index](senha) : true,
  }));
};

export const verificarSenhasConferem = (senha: string, confirmarSenha: string): boolean => {
  return senha.length > 0 && senha === confirmarSenha;
};
