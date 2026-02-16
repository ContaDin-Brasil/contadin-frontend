import { Banco, Vale } from '../types/carteira.types';

/**
 * Bancos padrão do sistema (alinhado com DB: instituicao)
 */
export const BANCOS_PADRAO: Banco[] = [
  { id: 1, nome: 'Santander', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#E31C23', icone: 'S', tipoInstituicao: 'banco' },
  { id: 2, nome: 'Nubank', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#820AD1', icone: 'Nu', tipoInstituicao: 'banco' },
  { id: 3, nome: 'Itaú', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#FF6600', icone: 'I', tipoInstituicao: 'banco' },
  { id: 4, nome: 'Bradesco', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#CC092F', icone: 'B', tipoInstituicao: 'banco' },
  { id: 5, nome: 'C6Bank', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#000', icone: 'C6', tipoInstituicao: 'banco' },
];

/**
 * Vales padrão do sistema (alinhado com DB: instituicao)
 */
export const VALES_PADRAO: Vale[] = [
  { id: 1, nome: 'Flash', balance: 'R$ 0,00', cor: '#FF1493', icone: 'F', tipoInstituicao: 'vale' },
  { id: 2, nome: 'Alelo', balance: 'R$ 0,00', cor: '#7FBA00', icone: 'A', tipoInstituicao: 'vale' },
];

/**
 * Lista de bancos disponíveis para seleção
 */
export const AVAILABLE_BANKS = [
  { nome: 'Santander', cor: '#E31C23', icone: 'S' },
  { nome: 'Nubank', cor: '#820AD1', icone: 'Nu' },
  { nome: 'Itaú', cor: '#FF6600', icone: 'I' },
  { nome: 'Bradesco', cor: '#CC092F', icone: 'B' },
  { nome: 'C6Bank', cor: '#000', icone: 'C6' },
  { nome: 'Banco do Brasil', cor: '#FFDD00', icone: 'BB' },
  { nome: 'Caixa', cor: '#0066A1', icone: 'CX' },
  { nome: 'Inter', cor: '#FF6600', icone: 'In' },
];

/**
 * Lista de vales disponíveis para seleção
 */
export const AVAILABLE_VOUCHERS = [
  { nome: 'Flash', cor: '#FF1493', icone: 'F', tipoInstituicao: 'vale' },
  { nome: 'Alelo', cor: '#7FBA00', icone: 'A', tipoInstituicao: 'vale' },
  { nome: 'VR', cor: '#E34234', icone: 'VR', tipoInstituicao: 'vale' },
  { nome: 'Sodexo', cor: '#ED1C24', icone: 'SD', tipoInstituicao: 'vale' },
  { nome: 'Ticket', cor: '#0095DA', icone: 'TK', tipoInstituicao: 'vale' },
];
