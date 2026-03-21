/**
 * Tipos para o Dashboard
 */

export interface ResumoFinanceiro {
  saldoTotal: number;
  receitaTotal: number;
  gastoTotal: number;
  mesAtual: string;
}

export interface GastoCategoria {
  id: number;
  nome: string;
  icone: string;
  valor: number;
  porcentagem: number;
  cor: string;
}

export interface SaldoInstituicao {
  id: number;
  nome: string;
  icone: string;
  valor: number;
  porcentagem: number;
  cor: string;
  tipo: 'banco' | 'vale';
}

export interface DadosDashboard {
  resumo: ResumoFinanceiro;
  gastosPorCategoria: GastoCategoria[];
  saldosPorInstituicao: SaldoInstituicao[];
  previsaoSaldo: DadosPrevisaoSaldo;
}

export interface PontoPrevisao {
  label: string;
  saldo: number;
  dataISO: string;
}

export interface DadosPrevisaoSaldo {
  pontos: PontoPrevisao[];
  saldoAtual: number;
  saldoFinal: number;
  diasFuturos: number;
}
