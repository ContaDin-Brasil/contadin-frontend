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

export type TipoInstituicao = 'BANCO' | 'VALE';

export type CategoriaApi = Category;
export type CategoriaPayload = CategoryFormData;

export interface CredenciaisLogin {
  email: string;
  senha: string;
}

export interface CadastroPayload {
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  senha: string;
  ativo?: boolean;
}

export interface UsuarioApi {
  id: string | number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  ativo: boolean;
  status?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface UsuarioPayload {
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
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
  id: number;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  data_transacao: string;
  parcelado: boolean;
  qtdParcelas?: number | null;
  recorrencia?: FrequencyType | null;
  fim_recorrencia?: string | null;
  fk_instituicao: string | number;
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
  fk_instituicao: string | number;
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
  fk_instituicao: string | number;
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