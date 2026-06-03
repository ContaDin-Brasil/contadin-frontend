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
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
 * Valida nome (não vazio, mínimo 2 caracteres)
 */
export function validarNome(nome: string): string | null {
  const nomeTrim = nome.trim();
  if (!nomeTrim) return 'Informe o nome.';
  if (nomeTrim.length < 2) return 'Nome deve ter pelo menos 2 caracteres.';
  return null;
}

/**
 * Valida sobrenome (não vazio, mínimo 2 caracteres)
 */
export function validarSobrenome(sobrenome: string): string | null {
  const sobrenomeTrim = sobrenome.trim();
  if (!sobrenomeTrim) return 'Informe o sobrenome.';
  if (sobrenomeTrim.length < 2) return 'Sobrenome deve ter pelo menos 2 caracteres.';
  return null;
}

/**
 * Valida email (formato válido)
 */
export function validarEmail(email: string): string | null {
  const emailTrim = email.trim();
  if (!emailTrim) return 'Informe o email.';
  if (!EMAIL_REGEX.test(emailTrim)) return 'Informe um email válido.';
  return null;
}

/**
 * Valida telefone (mínimo 10 dígitos)
 */
export function validarTelefone(telefone: string): string | null {
  const digitos = telefone.replace(/\D/g, '');
  if (!digitos) return 'Informe o telefone.';
  if (digitos.length < 10) return 'Telefone deve ter pelo menos 10 dígitos.';
  return null;
}

/**
 * Perfil inicial padrão (alinhado com DB)
 */
export const PERFIL_INICIAL = {
  nome: '',
  sobrenome: '',
  telefone: '',
  email: '',
  pushNotifications: true,
  darkTheme: false
};

/**
 * Informações de contato
 */
export const CONTATOS = {
  whatsapp: '(11) 982515080',
  whatsappLink: 'https://wa.me/5511982515080?text=Ola%2C%20preciso%20de%20ajuda%20com%20o%20Contadin.',
  email: 'contadinbrasil01@gmail.com'
};

/**
 * Outros canais de contato
 */
export const OUTROS_CONTATOS = [
  {
    id: 'site',
    titulo: 'Site',
    valor: 'www.contadin.com.br',
    url: 'https://www.contadin.com.br',
    icon: 'globe-outline'
  },
  {
    id: 'instagram',
    titulo: 'Instagram',
    valor: '@contadin',
    url: 'https://instagram.com/contadin',
    icon: 'logo-instagram'
  },
  {
    id: 'telefone',
    titulo: 'Telefone',
    valor: '(11) 3333-0000',
    url: 'tel:+551133330000',
    icon: 'call-outline'
  }
];

/**
 * Identificadores dos itens do FAQ (textos em i18n/idiomas/*.json → faq.{id})
 */
export const FAQ_ITENS = [
  { id: 'faq-01' },
  { id: 'faq-02' },
  { id: 'faq-03' },
  { id: 'faq-04' },
  { id: 'faq-05' },
  { id: 'faq-06' },
  { id: 'faq-07' },
  { id: 'faq-08' },
  { id: 'faq-09' },
  { id: 'faq-10' },
  { id: 'faq-11' },
  { id: 'faq-12' },
  { id: 'faq-13' },
  { id: 'faq-14' },
] as const;

/**
 * Tabs disponíveis na tela de ajuda
 */
export const TABS_AJUDA = ['FAQ', 'Contato', 'ChatBot'] as const;

/** ChatBot mockado — oculto até a equipe implementar */
export const EXIBIR_CHATBOT_AJUDA = false;

/** Outros canais (site, Instagram, telefone) — oculto até validar dados */
export const EXIBIR_OUTROS_CANAIS_AJUDA = false;
