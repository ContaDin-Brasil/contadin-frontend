import { Category, Frequency, Institution } from '../types/transacao.types';

/**
 * Categorias disponíveis
 * Nota: O campo 'icone' foi removido para alinhar com o schema do DB
 * Ícones podem ser mapeados no frontend baseado no nome da categoria
 */
export const CATEGORIES: Category[] = [
  { id: 1, nome: 'Alimentação' },
  { id: 2, nome: 'Lazer' },
  { id: 3, nome: 'Salário' },
];

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

/**
 * Configurações de parcelamento
 */
export const INSTALLMENT_CONFIG = {
  MIN_INSTALLMENTS: 2,
  MAX_INSTALLMENTS: 720,
  MIN_INSTALLMENT_VALUE: 0.01,
  WARNING_MIN_VALUE: 1.00, // Alerta se parcela for menor que R$ 1,00
};

/**
 * Instituições padrão (alinhado com DB)
 */
export const DEFAULT_INSTITUTIONS: Institution[] = [
  { id: 1, nome: 'Santander', cor: '#E31C23', icone: 'S' },
  { id: 2, nome: 'Nubank', cor: '#820AD1', icone: 'Nu' },
  { id: 3, nome: 'Itaú', cor: '#FF6600', icone: 'I' },
  { id: 4, nome: 'Flash', cor: '#FF1493', icone: 'F' },
];

/**
 * Transações mockadas para desenvolvimento
 * Estrutura alinhada com o schema do DB (tabela: transacao)
 */
export const MOCK_TRANSACTIONS = [
  {
    id: 1,
    descricao: 'Salário Avanade',
    valor: -60.59,
    tipo: 'GASTO' as const,
    data_transacao: new Date(),
    parcelado: false,
    fk_instituicao: 1,
    fk_categoria: 1
  },
  {
    id: 2,
    descricao: 'Almoço restaurante',
    valor: -60.59,
    tipo: 'GASTO' as const,
    data_transacao: new Date(),
    parcelado: false,
    fk_instituicao: 1,
    fk_categoria: 1
  },
  {
    id: 3,
    descricao: 'Freelance projeto',
    valor: 200,
    tipo: 'RECEITA' as const,
    data_transacao: new Date(),
    parcelado: false,
    fk_instituicao: 2,
    fk_categoria: 3
  },
  {
    id: 4,
    descricao: 'Supermercado',
    valor: -60.59,
    tipo: 'GASTO' as const,
    data_transacao: new Date('2026-02-04'),
    parcelado: false,
    fk_instituicao: 3,
    fk_categoria: 1
  },
  {
    id: 5,
    descricao: 'Salário mensal',
    valor: 200,
    tipo: 'RECEITA' as const,
    data_transacao: new Date('2026-02-04'),
    parcelado: false,
    fk_instituicao: 4,
    fk_categoria: 3
  },
  {
    id: 6,
    descricao: 'Café da manhã',
    valor: -60.59,
    tipo: 'GASTO' as const,
    data_transacao: new Date('2026-02-04'),
    parcelado: false,
    fk_instituicao: 1,
    fk_categoria: 1
  },
  {
    id: 7,
    descricao: 'Bônus',
    valor: 200,
    tipo: 'RECEITA' as const,
    data_transacao: new Date('2026-02-04'),
    parcelado: false,
    fk_instituicao: 4,
    fk_categoria: 3
  },
];
