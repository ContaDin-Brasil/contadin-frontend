import { Transaction, Category, Institution } from '../types/transacao.types';

/**
 * Formata um valor numérico para o formato de moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  const formatted = Math.abs(value).toFixed(2).replace('.', ',');
  return value >= 0 ? `+R$ ${formatted}` : `-R$ ${formatted}`;
};

/**
 * Retorna o nome do mês abreviado
 */
export const getMonthName = (dateString: string): string => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const month = parseInt(dateString.split('/')[1]) - 1;
  return months[month] + ', ' + dateString.split('/')[2];
};

/**
 * Formata o label da data, mostrando "Hoje" para data atual
 */
export const formatDateLabel = (dateString: string): string => {
  const today = new Date().toLocaleDateString('pt-BR');
  if (dateString === today) {
    return 'Hoje';
  }
  return dateString.split('/')[0] + ' ' + getMonthName(dateString);
};

/**
 * Agrupa transações por data
 */
export const groupTransactionsByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
  const grouped: Record<string, Transaction[]> = {};
  transactions.forEach(transaction => {
    const dateKey = new Date(transaction.data_transacao).toLocaleDateString('pt-BR');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });
  return grouped;
};

/**
 * Valida se uma transação está completa
 */
export const isTransactionValid = (descricao: string, valor?: number): boolean => {
  return descricao.trim().length > 0 && (valor === undefined || valor > 0);
};

/**
 * Busca uma categoria pelo ID
 */
export const getCategoryById = (categories: Category[], id: number): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

/**
 * Busca uma instituição pelo ID
 */
export const getInstitutionById = (institutions: Institution[], id: number): Institution | undefined => {
  return institutions.find(inst => inst.id === id);
};

/**
 * Mapeia o ícone da categoria baseado no nome (temporário até ter ícones no DB)
 */
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    'Alimentação': 'restaurant',
    'Lazer': 'happy',
    'Salário': 'cash',
    'Transporte': 'car',
    'Saúde': 'medkit',
    'Educação': 'school',
    'Moradia': 'home',
    'Outros': 'ellipsis-horizontal'
  };
  return iconMap[categoryName] || 'pricetag';
};
