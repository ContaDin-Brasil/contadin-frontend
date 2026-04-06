import { FrequenciaType, TipoLimiteType, TransactionType } from '../../../api/types';

export interface RecorrenciaUI extends RecorrenciaApi {
  proximaData?: string;
  diasRestantes?: number;
}

export interface RecorrenciaFormData {
  descricao: string;
  frequencia: FrequenciaType;
  intervalo: number;
  dia_inicio: string;
  tipo_limite: TipoLimiteType;
  data_fim?: string | null;
  qtd_ocorrencias?: number | null;
  valor: number;
  tipo: TransactionType;
  fk_categoria: number;
  fk_instituicao: number;
}

import type { RecorrenciaApi } from '../../../api/types';
