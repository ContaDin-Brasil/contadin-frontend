/**
 * Constantes para o módulo de Recorrências
 */

export const OPCOES_FREQUENCIA = [
  { value: 'DIARIA', label: 'Diária', descricao: 'A cada dia' },
  { value: 'SEMANAL', label: 'Semanal', descricao: 'A cada semana' },
  { value: 'MENSAL', label: 'Mensal', descricao: 'A cada mês' },
  { value: 'ANUAL', label: 'Anual', descricao: 'A cada ano' },
];

export const OPCOES_TIPO_LIMITE = [
  { value: 'INDEFINIDA', label: 'Sem Data Fim', descricao: 'Recorrência contínua indefinida' },
  { value: 'DATA', label: 'Com Data Fim', descricao: 'Define uma data para parar a recorrência' },
  { value: 'OCORRENCIAS', label: 'Por Ocorrências', descricao: 'Define uma quantidade de vezes' },
];

export const ICONES_FREQUENCIA: Record<string, string> = {
  DIARIA: 'calendar-outline',
  SEMANAL: 'calendar-outline',
  MENSAL: 'calendar-outline',
  ANUAL: 'calendar-outline',
};

export const LABELS_FREQUENCIA: Record<string, string> = {
  DIARIA: 'Diária',
  SEMANAL: 'Semanal',
  MENSAL: 'Mensal',
  ANUAL: 'Anual',
};

export const LABELS_TIPO_LIMITE: Record<string, string> = {
  INDEFINIDA: 'Sem limite',
  DATA: 'Até uma data',
  OCORRENCIAS: 'Por ocorrências',
};

/**
 * Cores para diferentes tipos de transações
 */
export const CORES_TIPO: Record<string, string> = {
  GASTO: '#E31C23',
  RECEITA: '#51CF66',
};

/**
 * Icones para status de recorrência
 */
export const ICONES_STATUS: Record<string, string> = {
  ativo: 'checkmark-circle',
  inativo: 'close-circle',
};

/**
 * ✨ NOVA LÓGICA: Separação Visual entre RECORRÊNCIA e PARCELADO
 * 
 * RECORRÊNCIA → tipo_limite = 'INDEFINIDA' ou 'DATA'
 *   - Repete infinitamente OU até uma data
 *   - Exemplo: Salário mensal, Aluguel (com prazo)
 * 
 * PARCELADO → tipo_limite = 'OCORRENCIAS'
 *   - Repete um número fixo de vezes
 *   - Exemplo: Academia 12 meses, Freelance 5 vezes
 */

/**
 * Determina se uma recorrência é tipo PARCELADO
 * @param tipoLimite - O tipo limite da recorrência
 * @returns true se é PARCELADO (ocorrências fixas), false se é RECORRÊNCIA
 */
export const isParcelado = (tipoLimite: string): boolean => {
  return tipoLimite === 'OCORRENCIAS';
};

/**
 * Determina se uma recorrência é tipo RECORRÊNCIA
 * @param tipoLimite - O tipo limite da recorrência
 * @returns true se é RECORRÊNCIA (indefinida ou com data), false se é PARCELADO
 */
export const isRecorrencia = (tipoLimite: string): boolean => {
  return tipoLimite === 'INDEFINIDA' || tipoLimite === 'DATA';
};

/**
 * Retorna o tipo visual: "RECORRÊNCIA" ou "PARCELADO"
 */
export const getTipoVisual = (tipoLimite: string): 'RECORRÊNCIA' | 'PARCELADO' => {
  return isParcelado(tipoLimite) ? 'PARCELADO' : 'RECORRÊNCIA';
};

/**
 * Cores para RECORRÊNCIA vs PARCELADO
 */
export const CORES_CATEGORIA_RECORRENCIA: Record<string, string> = {
  RECORRÊNCIA: '#5BA3FF', // Azul (repetição contínua)
  PARCELADO: '#FFB347', // Laranja (parcelas/ocorrências limitadas)
};

/**
 * Ícones para RECORRÊNCIA vs PARCELADO
 */
export const ICONES_CATEGORIA_RECORRENCIA: Record<string, string> = {
  RECORRÊNCIA: 'repeat-outline',
  PARCELADO: 'list-outline',
};

/**
 * Descrição amigável da frequência
 */
export const descricaoFrequencia = (frequencia: string, intervalo: number): string => {
  const base = LABELS_FREQUENCIA[frequencia] || frequencia;
  
  if (intervalo === 1) {
    return base.toLowerCase();
  }
  
  return `A cada ${intervalo} ${base.toLowerCase()}s`;
};

/**
 * Descrição amigável do tipo de limite
 */
export const descricaoTipoLimite = (
  tipoLimite: string, 
  dataFim?: string | null, 
  qtdOcorrencias?: number | null
): string => {
  if (tipoLimite === 'INDEFINIDA') {
    return 'Sem limite de duração';
  }
  
  if (tipoLimite === 'DATA' && dataFim) {
    const data = new Date(dataFim);
    return `Até ${data.toLocaleDateString('pt-BR')}`;
  }
  
  if (tipoLimite === 'OCORRENCIAS' && qtdOcorrencias) {
    return `${qtdOcorrencias} parcela(s)`;
  }
  
  return LABELS_TIPO_LIMITE[tipoLimite] || tipoLimite;
};

/**
 * Validação de intervalo
 */
export const INTERVALO_MIN = 1;
export const INTERVALO_MAX = 365;

/**
 * Mensagens de validação
 */
export const MENSAGENS_VALIDACAO = {
  descricaoObrigatoria: 'Descrição é obrigatória',
  valorObrigatorio: 'Valor é obrigatório',
  valorMaiorQueZero: 'Valor deve ser maior que zero',
  dataInicioObrigatoria: 'Data de início é obrigatória',
  dataFimObrigatoria: 'Data de término é obrigatória',
  qtdOcorrenciasObrigatoria: 'Quantidade de ocorrências é obrigatória',
  qtdOcorrenciasMaiorQueZero: 'Quantidade deve ser maior que zero',
  dataFimMenorQueInicio: 'Data de término deve ser após a data de início',
  categoriaObrigatoria: 'Categoria é obrigatória',
  instituicaoObrigatoria: 'Instituição é obrigatória',
  frequenciaObrigatoria: 'Frequência é obrigatória',
  intervaloInvalido: `Intervalo deve estar entre ${INTERVALO_MIN} e ${INTERVALO_MAX}`,
};
