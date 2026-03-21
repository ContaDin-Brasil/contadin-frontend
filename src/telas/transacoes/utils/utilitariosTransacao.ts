import { Transaction, Category, Institution } from '../types/transacao.types';

export const parseTransacaoDate = (value: any): Date => {
  if (!value) return new Date(0);

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    const datePart = value.split('T')[0];

    if (datePart.includes('/')) {
      const [day, month, year] = datePart.split('/');
      if (year && month && day) {
        return new Date(`${year}-${month}-${day}T00:00:00`);
      }
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return new Date(`${datePart}T00:00:00`);
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

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
    const dateKey = parseTransacaoDate(transaction.data_transacao).toLocaleDateString('pt-BR');
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
 * Retorna nomes de ícones do MaterialIcons para compatibilidade com a tela de categorias
 * @deprecated Use category.icone diretamente ao invés desta função
 */
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    'Alimentação': 'fastfood',
    'Lazer': 'sports-esports',
    'Salário': 'attach-money',
    'Transporte': 'directions-car',
    'Saúde': 'local-hospital',
    'Educação': 'school',
    'Moradia': 'home',
    'Investimentos': 'trending-up',
    'Outros': 'more-horiz'
  };
  return iconMap[categoryName] || 'local-offer';
};

/**
 * Retorna o ícone correto da categoria
 * Se a categoria tem um ícone definido, usa ele. Caso contrário, usa o mapeamento por nome.
 * Retorna nomes de ícones do MaterialIcons para compatibilidade
 */
export const getCategoryIconSafe = (category: Category | null | undefined): string => {
  if (!category) return 'local-offer';
  
  // Se a categoria tem um ícone definido, usa ele
  if (category.icone) {
    return category.icone;
  }
  
  // Fallback para mapeamento por nome
  return getCategoryIcon(category.nome);
};

/**
 * Ordena transações de acordo com o critério selecionado
 */
export const ordenarTransacoes = (transactions: Transaction[], criterio: string): Transaction[] => {
  const sorted = [...transactions];
  
  switch (criterio) {
    case 'Mais recentes':
      return sorted.sort((a, b) => parseTransacaoDate(b.data_transacao).getTime() - parseTransacaoDate(a.data_transacao).getTime());
    
    case 'Mais antigas':
      return sorted.sort((a, b) => parseTransacaoDate(a.data_transacao).getTime() - parseTransacaoDate(b.data_transacao).getTime());
    
    case 'Maior valor':
      return sorted.sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor));
    
    case 'Menor valor':
      return sorted.sort((a, b) => Math.abs(a.valor) - Math.abs(b.valor));
    
    case 'A-Z':
      return sorted.sort((a, b) => a.descricao.toLowerCase().localeCompare(b.descricao.toLowerCase()));
    
    case 'Z-A':
      return sorted.sort((a, b) => b.descricao.toLowerCase().localeCompare(a.descricao.toLowerCase()));
    
    default:
      return sorted.sort((a, b) => parseTransacaoDate(b.data_transacao).getTime() - parseTransacaoDate(a.data_transacao).getTime());
  }
};

export interface Filtros {
  tipo: 'TODOS' | 'RECEITA' | 'GASTO';
  instituicoes: number[];
  categorias: number[];
  valorMin: string;
  valorMax: string;
  apenasParcelado: boolean;
  apenasRecorrente: boolean;
  dataInicio: string;
  dataFim: string;
}

/**
 * Aplica filtros às transações
 */
export const aplicarFiltros = (transactions: Transaction[], filtros: Filtros): Transaction[] => {
  let filtered = [...transactions];

  // Filtro por tipo
  if (filtros.tipo !== 'TODOS') {
    filtered = filtered.filter(t => t.tipo === filtros.tipo);
  }

  // Filtro por instituições
  if (filtros.instituicoes.length > 0) {
    filtered = filtered.filter(t => filtros.instituicoes.includes(t.fk_instituicao));
  }

  // Filtro por categorias
  if (filtros.categorias.length > 0) {
    filtered = filtered.filter(t => filtros.categorias.includes(t.fk_categoria));
  }

  // Filtro por valor mínimo
  if (filtros.valorMin && filtros.valorMin.trim() !== '') {
    const minValue = parseFloat(filtros.valorMin.replace(',', '.'));
    if (!isNaN(minValue)) {
      filtered = filtered.filter(t => Math.abs(t.valor) >= minValue);
    }
  }

  // Filtro por valor máximo
  if (filtros.valorMax && filtros.valorMax.trim() !== '') {
    const maxValue = parseFloat(filtros.valorMax.replace(',', '.'));
    if (!isNaN(maxValue)) {
      filtered = filtered.filter(t => Math.abs(t.valor) <= maxValue);
    }
  }

  // Filtro por parcelado
  if (filtros.apenasParcelado) {
    filtered = filtered.filter(t => t.parcelado === true);
  }

  // Filtro por recorrente
  if (filtros.apenasRecorrente) {
    filtered = filtered.filter(t => t.recorrencia !== null && t.recorrencia !== '');
  }

  // Filtro por período
  if (filtros.dataInicio && filtros.dataInicio.trim() !== '') {
    // Converte DD/MM/YYYY para Date
    const [diaInicio, mesInicio, anoInicio] = filtros.dataInicio.split('/');
    const dataInicioDate = new Date(`${anoInicio}-${mesInicio}-${diaInicio}T00:00:00`);
    
    filtered = filtered.filter(t => {
      const dataTransacao = parseTransacaoDate(t.data_transacao);
      return dataTransacao >= dataInicioDate;
    });
  }

  if (filtros.dataFim && filtros.dataFim.trim() !== '') {
    // Converte DD/MM/YYYY para Date
    const [diaFim, mesFim, anoFim] = filtros.dataFim.split('/');
    const dataFimDate = new Date(`${anoFim}-${mesFim}-${diaFim}T23:59:59`);
    
    filtered = filtered.filter(t => {
      const dataTransacao = parseTransacaoDate(t.data_transacao);
      return dataTransacao <= dataFimDate;
    });
  }

  return filtered;
};
