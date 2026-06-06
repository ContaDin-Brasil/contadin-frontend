/**
 * Instituições padrões disponíveis para o usuário adicionar
 * Baseadas nos logos disponíveis em assets/logos/instituicoes/
 */

export const BANCOS_PADRAO = [
  {
    id: 'nubank',
    nome: 'Nubank',
    icone: 'Nu',
    cor: '#820AD1',
    type: 'BANCO',
  },
  {
    id: 'inter',
    nome: 'Inter',
    icone: 'Int',
    cor: '#FF6600',
    type: 'BANCO',
  },
  {
    id: 'itau',
    nome: 'Itaú',
    icone: 'It',
    cor: '#FF7A00',
    type: 'BANCO',
  },
  {
    id: 'santander',
    nome: 'Santander',
    icone: 'San',
    cor: '#E31C23',
    type: 'BANCO',
  },
  {
    id: 'bradesco',
    nome: 'Bradesco',
    icone: 'Bra',
    cor: '#CC092F',
    type: 'BANCO',
  },
  {
    id: 'banco-do-brasil',
    nome: 'Banco do Brasil',
    icone: 'BB',
    cor: '#FFED00',
    type: 'BANCO',
  },
  {
    id: 'caixa',
    nome: 'Caixa',
    icone: 'CEF',
    cor: '#005CA9',
    type: 'BANCO',
  },
  {
    id: 'c6-bank',
    nome: 'C6 Bank',
    icone: 'C6',
    cor: '#000000',
    type: 'BANCO',
  },
  {
    id: 'next',
    nome: 'Next',
    icone: 'Nx',
    cor: '#00AB63',
    type: 'BANCO',
  },
  {
    id: 'neon',
    nome: 'Neon',
    icone: 'Ne',
    cor: '#00D9E1',
    type: 'BANCO',
  },
  {
    id: 'picpay',
    nome: 'PicPay',
    icone: 'PP',
    cor: '#21C25E',
    type: 'BANCO',
  },
  {
    id: 'mercado-pago',
    nome: 'Mercado Pago',
    icone: 'MP',
    cor: '#009EE3',
    type: 'BANCO',
  },
];

export const VALES_PADRAO = [
  {
    id: 'alelo',
    nome: 'Alelo',
    icone: 'Al',
    cor: '#BDD654',
    type: 'VALE',
  },
  {
    id: 'sodexo',
    nome: 'Sodexo',
    icone: 'Sd',
    cor: '#002A54',
    type: 'VALE',
  },
  {
    id: 'ticket',
    nome: 'Ticket',
    icone: 'Tk',
    cor: '#F72717',
    type: 'VALE',
  },
  {
    id: 'flash',
    nome: 'Flash',
    icone: 'Fl',
    cor: '#FE2B8F',
    type: 'VALE',
  },
  {
    id: 'vr-beneficios',
    nome: 'VR Benefícios',
    icone: 'VR',
    cor: '#00B11D',
    type: 'VALE',
  },
  {
    id: 'ben-visa-vale',
    nome: 'Ben Visa Vale',
    icone: 'BV',
    cor: '#000000',
    type: 'VALE',
  },
];

/**
 * Retorna instituições padrões filtradas por tipo
 * @param {string} tipo - 'banco' ou 'vale'
 * @returns {Array} Lista de instituições do tipo especificado
 */
export const getInstituicoesPadrao = (tipo) => {
  if (tipo === 'banco') {
    return BANCOS_PADRAO;
  } else if (tipo === 'vale') {
    return VALES_PADRAO;
  }
  return [...BANCOS_PADRAO, ...VALES_PADRAO];
};
