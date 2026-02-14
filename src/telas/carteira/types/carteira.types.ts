// Tipos de visualização (apenas UI - não existe no DB)
export type ViewMode = 'grid' | 'list';

// Interface base para instituições financeiras (alinhado com DB: instituicao)
export interface Instituicao {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  balance: string; // Calculado, não armazenado no DB
  fk_usuario?: number;
}

// Interface para bancos (inclui despesas - calculado)
export interface Banco extends Instituicao {
  expenses?: string;
}

// Interface para vales
export interface Vale extends Instituicao {}

// Estado do gerenciador de carteira (para UI)
export interface CarteiraState {
  banks: Banco[];
  vouchers: Vale[];
  viewMode: ViewMode;
  bankSelectionModalVisible: boolean;
  bankCustomModalVisible: boolean;
  voucherSelectionModalVisible: boolean;
  voucherCustomModalVisible: boolean;
}
