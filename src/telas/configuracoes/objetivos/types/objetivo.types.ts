import type {
  ObjetivoPrioridadeApi,
  ObjetivoStatusApi,
  ObjetivoTipoApi,
} from '../../../../api/types';

export type TipoCategoriaObjetivo = 'GASTO' | 'RECEITA' | 'GLOBAL';

export type ObjetivoStatusLabel =
  | 'no caminho'
  | 'bom ritmo'
  | 'falta pouco'
  | 'meta batida'
  | 'tranquilo'
  | 'atenção'
  | 'cuidado'
  | 'acima do combinado';

export type ObjetivoUi = {
  id: string | number;
  nome: string;
  descricao?: string | null;
  tipo: ObjetivoTipoApi;
  categoriaId: string | number | null;
  categoria: string;
  valorAlvo: number;
  valorRealizado: number;
  percentualRealizado: number;
  percentualRealizadoClamp: number;
  status: ObjetivoStatusLabel;
  statusApi: ObjetivoStatusApi;
  dataInicio: string;
  dataFim: string;
  prioridade?: ObjetivoPrioridadeApi | null;
  insight: string;
  alertaScore: number;
  alertaLabel: string;
  diasTotais: number;
  diasPassados: number;
};

export type ResumoObjetivos = {
  total: number;
  noRitmo: number;
  impacto: number;
  maiorAlerta: string;
  recomendacao: string;
};
