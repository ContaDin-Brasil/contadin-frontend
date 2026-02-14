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
