import { Frequency } from '../types/transacao.types';

/**
 * Frequências/Recorrências disponíveis (alinhado com DB)
 */
export const FREQUENCIES: Frequency[] = [
  { id: 'ANUAL', nome: 'Anual' },
  { id: 'MENSAL', nome: 'Mensal' },
  { id: 'SEMANAL', nome: 'Semanal' },
  { id: 'DIARIO', nome: 'Diária' },
];

/**
 * Opções de parcelamento disponíveis para o picker
 * Opções comuns no mercado brasileiro
 */
export const INSTALLMENT_OPTIONS = [
  { value: 2, label: '2 parcelas' },
  { value: 3, label: '3 parcelas' },
  { value: 4, label: '4 parcelas' },
  { value: 5, label: '5 parcelas' },
  { value: 6, label: '6 parcelas' },
  { value: 7, label: '7 parcelas' },
  { value: 8, label: '8 parcelas' },
  { value: 9, label: '9 parcelas' },
  { value: 10, label: '10 parcelas' },
  { value: 11, label: '11 parcelas' },
  { value: 12, label: '12 parcelas' },
  { value: 0, label: 'Outro valor' }, // Valor especial para indicar input customizado
];
