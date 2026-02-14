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
  'Deve conter ao menos 1 caractere especial (!, @, $, % ou &).',
  'Não deve conter sequência numérica ex.(123, 321 ou 456).',
  'Não deve conter 3 números repetidos ex.(111, 222 ou 777).'
];

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
