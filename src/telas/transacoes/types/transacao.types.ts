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
  id: number;
  nome: string;
  icone: string;
  cor: string;
  fk_usuario?: number;
}

// Interface de Categoria (alinhado com DB: categoria)
export interface Category {
  id: number;
  nome: string;
  tipo: 'RECEITA' | 'GASTO' | 'GLOBAL';
  cor: string;
  icone: string;
  fk_usuario: number | null;
}

// Interface de Frequência (para UI)
export interface Frequency {
  id: FrequencyType;
  nome: string;
}

// Interface de Transação (alinhado com DB: transacao)
export interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  data_transacao: Date;
  parcelado: boolean;
  qtdParcelas?: number;
  recorrencia?: FrequencyType;
  fim_recorrencia?: Date;
  fk_instituicao: number;
  fk_categoria: number;
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
