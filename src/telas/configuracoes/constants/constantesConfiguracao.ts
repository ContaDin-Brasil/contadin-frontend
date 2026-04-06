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
 * Itens do FAQ (ajuste os textos quando quiser)
 */
export const FAQ_ITENS = [
  {
    id: 'faq-01',
    pergunta: 'Como cadastrar uma transacao?',
    resposta: 'Resposta a definir.'
  },
  {
    id: 'faq-02',
    pergunta: 'Como editar ou excluir um gasto?',
    resposta: 'Resposta a definir.'
  },
  {
    id: 'faq-03',
    pergunta: 'Como criar e organizar categorias?',
    resposta: 'Resposta a definir.'
  },
  {
    id: 'faq-04',
    pergunta: 'Como recuperar minha senha?',
    resposta: 'Resposta a definir.'
  }
];

/**
 * Tabs disponíveis na tela de ajuda
 */
export const TABS_AJUDA = ['FAQ', 'Contato', 'ChatBot'] as const;
