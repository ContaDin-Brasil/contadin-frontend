import { Banco, Vale } from '../types/carteira.types';

/**
 * Bancos padrão do sistema (alinhado com DB: instituicao)
 */
export const BANCOS_PADRAO: Banco[] = [
  { id: 1, nome: 'Santander', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#E31C23', icone: 'S', type: 'BANCO' },
  { id: 2, nome: 'Nubank', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#820AD1', icone: 'Nu', type: 'BANCO' },
  { id: 3, nome: 'Itaú', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#FF6600', icone: 'I', type: 'BANCO' },
  { id: 4, nome: 'Bradesco', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#CC092F', icone: 'B', type: 'BANCO' },
  { id: 5, nome: 'C6Bank', balance: 'R$ 0,00', expenses: 'R$ 0,00', cor: '#000', icone: 'C6', type: 'BANCO' },
];

/**
 * Vales padrão do sistema (alinhado com DB: instituicao)
 */
export const VALES_PADRAO: Vale[] = [
  { id: 1, nome: 'Flash', balance: 'R$ 0,00', cor: '#FF1493', icone: 'F', type: 'VALE' },
  { id: 2, nome: 'Alelo', balance: 'R$ 0,00', cor: '#7FBA00', icone: 'A', type: 'VALE' },
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
  { nome: 'Flash', cor: '#FF1493', icone: 'F', type: 'VALE' },
  { nome: 'Alelo', cor: '#7FBA00', icone: 'A', type: 'VALE' },
  { nome: 'VR', cor: '#E34234', icone: 'VR', type: 'VALE' },
  { nome: 'Sodexo', cor: '#ED1C24', icone: 'SD', type: 'VALE' },
  { nome: 'Ticket', cor: '#0095DA', icone: 'TK', type: 'VALE' },
];
