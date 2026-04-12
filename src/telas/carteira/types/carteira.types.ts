// Interface base para instituições financeiras (alinhado com DB: instituicao)
export interface Instituicao {
  id: string | number;
  nome: string;
  icone: string;
  cor: string;
  type: 'BANCO' | 'VALE';
  balance: string; // Calculado, não armazenado no DB
  fk_usuario?: string | number;
  fkUsuario?: string | number;
  ativo?: boolean;
}

// Interface para bancos (inclui despesas - calculado)
export interface Banco extends Instituicao {
  type: 'BANCO';
  expenses?: string;
}

// Interface para vales
export interface Vale extends Instituicao {
  type: 'VALE';
}

// Estado do gerenciador de carteira (para UI)
export interface CarteiraState {
  banks: Banco[];
  vouchers: Vale[];
  bankSelectionModalVisible: boolean;
  bankCustomModalVisible: boolean;
  voucherSelectionModalVisible: boolean;
  voucherCustomModalVisible: boolean;
}
