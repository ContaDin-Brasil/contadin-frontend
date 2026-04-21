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
    pergunta: 'Como cadastrar minha primeira transação?',
    resposta:
      'Vá em Transações, toque no botão +, preencha descrição, valor, tipo, instituição e categoria. Depois toque em Salvar. Se não houver instituição ou categoria, crie antes na Carteira ou em Categorias.'
  },
  {
    id: 'faq-02',
    pergunta: 'Como editar ou excluir um gasto?',
    resposta:
      'Abra Transações, toque no item desejado para entrar na edição. Na tela de edição você pode atualizar os campos e salvar, ou excluir a transação.'
  },
  {
    id: 'faq-03',
    pergunta: 'Como filtrar transações para achar um lançamento rápido?',
    resposta:
      'Use a busca por texto no topo da tela de transações e combine com filtros por tipo, instituição, categoria, valor e período. Você também pode ordenar por data, valor e ordem alfabética.'
  },
  {
    id: 'faq-04',
    pergunta: 'Qual a diferença entre transação recorrente e parcelada?',
    resposta:
      'Recorrente repete automaticamente em uma frequência (diária, semanal, mensal ou anual). Parcelada divide uma compra em várias parcelas. No formulário, as duas opções são exclusivas para evitar conflito.'
  },
  {
    id: 'faq-05',
    pergunta: 'Por que não consigo salvar uma transação?',
    resposta:
      'Os campos obrigatórios são descrição, valor, instituição e categoria. Também valide se o valor é maior que zero e se a data está completa no formato dd/mm/aaaa.'
  },
  {
    id: 'faq-06',
    pergunta: 'Como adicionar bancos e vales na carteira?',
    resposta:
      'Abra Carteira e use Adicionar em Contas Bancárias ou Vales. Você pode escolher instituições padrão ou cadastrar uma instituição customizada com nome, cor e ícone.'
  },
  {
    id: 'faq-07',
    pergunta: 'Como criar e organizar categorias?',
    resposta:
      'Acesse Categorias para criar, editar e excluir. Use categorias de GASTO para despesas, de RECEITA para entradas e GLOBAL para categorias que podem aparecer nos dois tipos.'
  },
  {
    id: 'faq-08',
    pergunta: 'Como usar foto para preencher transação com IA?',
    resposta:
      'Na tela Adicionar Transação, toque em Foto, escolha câmera ou galeria e aguarde a sugestão. Você pode aceitar os dados sugeridos ou descartar e preencher manualmente.'
  },
  {
    id: 'faq-09',
    pergunta: 'Como funciona o saldo na carteira?',
    resposta:
      'O saldo de cada instituição é calculado automaticamente: soma de receitas menos soma de gastos vinculados àquela instituição.'
  },
  {
    id: 'faq-10',
    pergunta: 'Quais arquivos são aceitos na importação?',
    resposta:
      'A importação aceita arquivos .xlsx, .xls e .csv. Se o arquivo estiver fora desses formatos, o app mostra um alerta de arquivo inválido.'
  },
  {
    id: 'faq-11',
    pergunta: 'Preciso ter instituições e categorias cadastradas antes?',
    resposta:
      'Sim, é recomendado. O app tenta vincular automaticamente com o que já existe. Se faltar instituição ou categoria detectada na planilha, você pode cadastrar direto na tela de revisão.'
  },
  {
    id: 'faq-12',
    pergunta: 'O que significa transação pendente na importação?',
    resposta:
      'Pendente significa que falta algum campo obrigatório (descrição, valor, data, instituição ou categoria). Abra o card da transação, ajuste os campos e marque para salvar.'
  },
  {
    id: 'faq-13',
    pergunta: 'Posso salvar apenas parte das transações importadas?',
    resposta:
      'Sim. Você revisa item por item e escolhe quais enviar. No final, o app mostra quantas transações foram criadas e quantas falharam na confirmação.'
  },
  {
    id: 'faq-14',
    pergunta: 'Como recuperar minha senha?',
    resposta:
      'Na tela de login, use Esqueci minha senha. Informe seu e-mail, valide o código recebido e defina uma nova senha seguindo os requisitos de segurança do app.'
  },
];

/**
 * Tabs disponíveis na tela de ajuda
 */
export const TABS_AJUDA = ['FAQ', 'Contato', 'ChatBot'] as const;
