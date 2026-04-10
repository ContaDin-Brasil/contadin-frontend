import type {
  Category,
  CategoryFormData,
} from '../telas/categorias/types/categoria.types';
import type {
  DadosDashboard,
  DadosPrevisaoSaldo,
  GastoCategoria,
  ResumoFinanceiro,
  SaldoInstituicao,
} from '../telas/dashboard/types/dashboard.types';
import type { FrequencyType, TransactionType } from '../telas/transacoes/types/transacao.types';

export type CategoriaApi = Category;
export type CategoriaPayload = CategoryFormData;

export interface CredenciaisLogin {
  email: string;
  senha: string;
}

export interface UsuarioApi {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  tel: string;
  ativo: boolean;
}

export interface UsuarioPayload {
  nome: string;
  sobrenome: string;
  email: string;
  tel: string;
  senha?: string;
  ativo?: boolean;
}

export type UsuarioParcialPayload = Partial<UsuarioPayload>;

export interface UsuarioAutenticado {
  id: number;
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

export interface AlterarSenhaPayload {
  token: string;
  senha: string;
}

export interface InstituicaoApi {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  tipoInstituicao: 'banco' | 'vale';
  fk_usuario?: number;
}

export interface InstituicaoPayload {
  nome: string;
  icone: string;
  cor: string;
  tipoInstituicao: 'banco' | 'vale';
  fk_usuario?: number;
}

export interface InstituicaoComTransacoes extends InstituicaoApi {
  transacao?: TransacaoApi[];
}

export interface TransacaoApi {
  id: number;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  data_transacao: string;
  parcelado: boolean;
  qtdParcelas?: number | null;
  recorrencia?: FrequencyType | null;
  fim_recorrencia?: string | null;
  fk_instituicao: number;
  fk_categoria: number;
}

export interface TransacaoPayload {
  descricao: string;
  valor: number;
  tipo: TransactionType;
  data_transacao: string;
  parcelado: boolean;
  qtdParcelas?: number | null;
  recorrencia?: FrequencyType | null;
  fim_recorrencia?: string | null;
  fk_instituicao: number;
  fk_categoria: number;
}

export interface MetaGastoApi {
  id: number;
  valor_meta: number;
  data_inicio_meta: string;
  data_fim_meta: string;
  fk_categoria: number;
  fk_usuario: number;
}

export interface MetaGastoPayload {
  valor_meta: number;
  data_inicio_meta: string;
  data_fim_meta: string;
  fk_categoria: number;
  fk_usuario: number;
}

export interface TransacaoOrfa {
  id: number;
  descricao: string;
  fk_instituicao: number;
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
 * Tipos para o serviço OCR (AI/Scan - Python endpoint)
 */

export interface OCRTransacao {
  valor: number;
  tipo: TransactionType;
  descricao: string;
  data_transacao: string; // ISO 8601 format
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