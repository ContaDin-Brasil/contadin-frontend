/**
 * Constantes da API
 * Valores fixos e enumerações usados nas requisições
 */

/**
 * Tipos de transação
 */
export const TIPO_TRANSACAO = {
  GASTO: 'GASTO',
  RECEITA: 'RECEITA',
} as const;

/**
 * Tipos de recorrência
 */
export const TIPO_RECORRENCIA = {
  DIARIO: 'DIARIO',
  SEMANAL: 'SEMANAL',
  MENSAL: 'MENSAL',
  ANUAL: 'ANUAL',
} as const;

/**
 * Status HTTP comuns
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Mensagens de erro padrão
 */
export const MENSAGENS_ERRO = {
  REDE: 'Erro de conexão. Verifique sua internet.',
  SERVIDOR: 'Erro no servidor. Tente novamente mais tarde.',
  NAO_ENCONTRADO: 'Recurso não encontrado.',
  NAO_AUTORIZADO: 'Você não tem permissão para esta ação.',
  ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
} as const;

/**
 * Limites de paginação
 */
export const PAGINACAO = {
  LIMITE_PADRAO: 10,
  LIMITE_MAXIMO: 100,
} as const;
