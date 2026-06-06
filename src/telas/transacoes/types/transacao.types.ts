// Tipos de transação (alinhado com DB)
export type TransactionType = 'GASTO' | 'RECEITA';

// Tipos de instituição (apenas para UI - não existe no DB)
export type InstitutionType = 'banks' | 'vouchers';

// Tipos de frequência/recorrência (alinhado com DB)
export type FrequencyType = 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'ANUAL';

// Tipos de processamento (apenas para UI)
export type ProcessingType = 'photo' | 'audio';

// Interface de Instituição (alinhado com DB: instituicao)
export interface Institution {
  id: string | number;
  nome: string;
  icone: string;
  cor: string;
  fkUsuario?: string | number;
}

// Interface de Categoria (alinhado com DB: categoria)
export interface Category {
  id: string | number;
  nome: string;
  tipo: 'RECEITA' | 'GASTO' | 'GLOBAL';
  cor: string;
  icone: string;
  fkUsuario?: string | number | null;
}

// Interface de Frequência (para UI)
export interface Frequency {
  id: FrequencyType;
  nome: string;
}

// Interface de Transação (alinhado com DB: transacao)
export interface Transaction {
  id: string | number;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  dataTransacao: string | Date;
  parcelado: boolean;
  qtdParcelas?: number | null;
  recorrencia?: FrequencyType | null;
  fimRecorrencia?: string | Date | null;
  fkInstituicao?: string | number | null;
  fkCategoria?: string | number | null;
}

export interface FiltrosTransacao {
  tipo: 'TODOS' | 'RECEITA' | 'GASTO';
  instituicoes: Array<string | number>;
  categorias: Array<string | number>;
  valorMin: string;
  valorMax: string;
  apenasParcelado: boolean;
  apenasRecorrente: boolean;
  dataInicio: string;
  dataFim: string;
}

export interface ListarTransacoesParams {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc' | 'ASC' | 'DESC';
  tipo?: 'GASTO' | 'RECEITA';
  fkInstituicao?: string | number;
  fkCategoria?: string | number;
  valorGte?: number;
  valorLte?: number;
  parcelado?: boolean;
  recorrente?: boolean;
  dataTransacaoGte?: string;
  dataTransacaoLte?: string;
  search?: string;
}

export interface TransacoesPaginadas<T = Transaction> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// Interface de Sugestão da IA (para UI)
export interface AISuggestion {
  descricao: string;
  valor: string;
  categoria: string;
  tipo: TransactionType;
  instituicao: string;
  data?: string; // Data opcional no formato DD/MM/YYYY
}

// Interface do Estado do Formulário de Transação (para UI)
export interface TransactionFormState {
  descricao: string;
  tipo: TransactionType;
  categorySearch: string;
  selectedCategory: string;
  isRecurring: boolean;
  frequency: FrequencyType;
  institutionType: InstitutionType;
  selectedInstitutions: Institution[];
}
