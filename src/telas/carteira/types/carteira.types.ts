// Interface base para instituições financeiras (alinhado com DB: instituicao)
export interface Instituicao {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  tipoInstituicao: 'banco' | 'vale';
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
  bankSelectionModalVisible: boolean;
  bankCustomModalVisible: boolean;
  voucherSelectionModalVisible: boolean;
  voucherCustomModalVisible: boolean;
}
