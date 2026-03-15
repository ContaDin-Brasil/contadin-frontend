/**
 * Constantes para o módulo de configurações
 * Alinhado com esquema do DB: usuario
 */

/**
 * Requisitos de senha para validação
 */
export const REQUISITOS_SENHA = [
  'Deve conter ao menos 8 caracteres.',
  'Deve conter ao menos 1 número.',
  'Deve conter ao menos 1 caractere especial (!, @, $, %, & ou _).',
  'Não deve conter sequência numérica ex.(123, 321 ou 456).',
  'Não deve conter 3 números repetidos ex.(111, 222 ou 777).'
];

const SENHA_NUMERO = /\d/;
const SENHA_ESPECIAL = /[!@$%&_]/;
const SEQUENCIA_NUM =
  /(123|234|345|456|567|678|789|321|432|543|654|765|876|987)/;
const TRES_IGUAIS = /(\d)\1{2}/;

/**
 * Valida a senha conforme REQUISITOS_SENHA. Retorna a mensagem de erro ou null se válida.
 */
export function validarSenha(senha: string): string | null {
  if (senha.length < 8) return REQUISITOS_SENHA[0];
  if (!SENHA_NUMERO.test(senha)) return REQUISITOS_SENHA[1];
  if (!SENHA_ESPECIAL.test(senha)) return REQUISITOS_SENHA[2];
  if (SEQUENCIA_NUM.test(senha)) return REQUISITOS_SENHA[3];
  if (TRES_IGUAIS.test(senha)) return REQUISITOS_SENHA[4];
  return null;
}

/**
 * Perfil inicial padrão (alinhado com DB)
 */
export const PERFIL_INICIAL = {
  nome: '',
  sobrenome: '',
  tel: '',
  email: '',
  pushNotifications: true,
  darkTheme: false
};

/**
 * Informações de contato
 */
export const CONTATOS = {
  whatsapp: '(11) 94002-8922',
  email: 'contato@contadin.com.br'
};

/**
 * Tabs disponíveis na tela de ajuda
 */
export const TABS_AJUDA = ['FAQ', 'Contato', 'ChatBot'] as const;
