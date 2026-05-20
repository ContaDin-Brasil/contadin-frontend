import type {
  Category,
  CategoryType,
} from '../telas/categorias/types/categoria.types';
import type {
  DadosDashboard,
  DadosPrevisaoSaldo,
  GastoCategoria,
  ResumoFinanceiro,
  SaldoInstituicao,
} from '../telas/dashboard/types/dashboard.types';
import type { FrequencyType, TransactionType } from '../telas/transacoes/types/transacao.types';

export type TipoInstituicao = 'BANCO' | 'VALE';

export type CategoriaApi = Category;

export interface CategoriaPayload {
  nome: string;
  icone: string;
  cor: string;
  tipo: CategoryType;
  fkUsuario: string | number;
  fk_usuario?: string | number;
}

export type CategoriaAtualizacaoPayload = Partial<CategoriaPayload>;

export interface CredenciaisLogin {
  email: string;
  senha: string;
}

export interface CadastroPayload {
  nome: string | null;
  sobrenome: string | null;
  email: string;
  telefone?: string | null;
  senha: string;
  ativo?: boolean;
}

export interface UsuarioApi {
  id: string | number;
  nome: string | null;
  sobrenome: string | null;
  email: string;
  telefone?: string | null;
  ativo: boolean;
  status?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface UsuarioPayload {
  nome: string | null;
  sobrenome: string | null;
  email: string;
  telefone?: string | null;
  senha?: string;
  ativo?: boolean;
}

export type UsuarioParcialPayload = Partial<UsuarioPayload>;

export interface UsuarioAutenticado {
  id: string | number;
  nome: string;
  sobrenome: string;
  email: string;
}

export interface RespostaLogin {
  data: {
    token: string;
    user: UsuarioAutenticado;
  };
}

export interface RecuperarSenhaPayload {
  email: string;
}

export interface ValidarPinPayload {
  email: string;
  pin: string;
}

export interface ReenviarPinPayload {
  email: string;
}

export interface RedefinirSenhaPayload {
  email: string;
  pin: string;
  novaSenha: string;
  confirmacaoSenha: string;
}

export interface AlterarSenhaPayload {
  id: string | number;
  senhaAtual: string;
  novaSenha: string;
  confirmacaoNovaSenha: string;
}

export interface InstituicaoApi {
  id: string | number;
  nome: string;
  icone: string;
  cor: string;
  type: TipoInstituicao;
  fk_usuario?: string | number;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
  fkUsuario?: string | number;
}

export interface InstituicaoPayload {
  nome: string;
  icone: string;
  cor: string;
  type: TipoInstituicao;
  fk_usuario?: string | number;
  ativo?: boolean;
  fkUsuario?: string | number;
}

export interface InstituicaoComTransacoes extends InstituicaoApi {
  transacao?: TransacaoApi[];
}

export interface TransacaoApi {
  id: string | number;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  dataTransacao: string;
  parcelado: boolean;
  qtdParcelas?: number | null;
  recorrencia?: FrequencyType | null;
  fimRecorrencia?: string | null;
  ativo: boolean | null;
  fkInstituicao?: string | number | null;
  fkCategoria?: string | number | null;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface TransacaoPayload {
  descricao: string;
  valor: number;
  tipo: TransactionType;
  dataTransacao: string;
  parcelado: boolean;
  qtdParcelas?: number | null;
  recorrencia?: FrequencyType | null;
  fimRecorrencia?: string | null;
  ativo?: boolean;
  fkInstituicao: string | number;
  fkCategoria: string | number;
}

export type ObjetivoTipoApi = 'LIMITE_GASTO' | 'AUMENTO_RECEITA';
export type ObjetivoStatusApi = 'TRANQUILO' | 'ATENCAO' | 'ESTOURADO' | 'CONCLUIDO' | 'ABAIXO_RITMO';
export type ObjetivoPrioridadeApi = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface ObjetivoGastoApi {
  id: string | number;
  nome: string;
  descricao?: string | null;
  tipoObjetivo: ObjetivoTipoApi;
  valor: number;
  realizado: number;
  percentual: number;
  status: ObjetivoStatusApi;
  dataInicio: string;
  dataFim: string;
  prioridade?: ObjetivoPrioridadeApi | null;
  fkCategoria: string | number;
  fkUsuario?: string | number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ObjetivoGastoPayload {
  tipoObjetivo: ObjetivoTipoApi;
  nome: string;
  descricao?: string | null;
  valor: number;
  dataInicio: string;
  dataFim: string;
  prioridade?: ObjetivoPrioridadeApi | null;
  fkCategoria: string | number;
  fkUsuario: string | number;
}

export type ObjetivoKpiQuery = {
  dataInicio?: string;
  dataFim?: string;
  tipoObjetivo?: ObjetivoTipoApi;
};

export type ObjetivoKpiImpactoResponse = {
  impactoPrevistoMes: number;
};

export type ObjetivoKpiMaiorAlertaResponse = {
  maiorAlerta: string;
  objetivoId?: string | number | null;
  status?: ObjetivoStatusApi | null;
  tipoObjetivo?: ObjetivoTipoApi | null;
};

export type ObjetivoKpiNoRitmoResponse = {
  objetivosNoRitmo: number;
  totalObjetivos: number;
  objetivos?: Array<{
    id: string | number;
    nome: string;
    tipoObjetivo: ObjetivoTipoApi;
    status: ObjetivoStatusApi;
    percentual: number;
  }>;
};

export type ObjetivoKpiAcaoRecomendadaResponse = {
  acao_recomendada: string;
  objetivo_id?: string | number | null;
};

export type ObjetivoKpiInsightResponse = {
  objetivo_id: string | number;
  insight: string;
};

export interface TransacaoOrfa {
  id: string | number;
  descricao: string;
  fkInstituicao: string | number;
}

export interface ResultadoLimpezaOrfaos {
  deletadas: number;
  transacoesOrfas: TransacaoOrfa[];
}

export type ResumoFinanceiroApi = ResumoFinanceiro;
export type GastoCategoriaApi = GastoCategoria;
export type SaldoInstituicaoApi = SaldoInstituicao;
export type DadosPrevisaoSaldoApi = DadosPrevisaoSaldo;
export type DadosDashboardApi = DadosDashboard;

/**
 * Tipos para o endpoint de indicadores de transações
 * GET /indicadores-transacoes
 */
export interface DashReceitaGastoResponse {
  mes: number;
  tipo: 'GASTO' | 'RECEITA';
  valorTotal: number;
}

/**
 * Tipos para o serviço OCR (AI/Scan - Python endpoint)
 */

export interface OCRTransacao {
  valor: number;
  tipo: TransactionType;
  descricao: string;
  data_transacao: string | null; // ISO 8601 format, null quando não identificada
  parcelado: boolean;
  recorrencia?: string;
  fim_transacao?: string;
  instituicao?: string;
  categoria?: string;
  fk_instituicao: number;
  fk_categoria: number;
}

export interface OCRInstituicao {
  nome: string;
  tipo: string;
  icone: string;
  cor: string;
  id_existente: number;
}

export interface OCRResponse200 {
  transacao: OCRTransacao;
  instituicao: OCRInstituicao;
}

export interface OCRValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: string;
  ctx?: Record<string, any>;
}

export interface OCRResponseError422 {
  detail: OCRValidationError[];
}