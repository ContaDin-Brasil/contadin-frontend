/**
 * Constantes do Dashboard
 */

export const CONFIGURACAO_GRAFICO = {
  ALTURA: 220,
  LARGURA_BARRA: 30,
  ESPACAMENTO: 20,
  DIAS_VISIVEIS: 6,
  ANIMACAO_DURACAO: 300,
};

export const CACHE_KEYS = {
  RESUMO: 'dashboard:resumo',
  GASTOS_CATEGORIA: 'dashboard:gastos-categoria',
  SALDOS_INSTITUICAO: 'dashboard:saldos-instituicao',
  GRAFICO_PREVISAO: 'dashboard:grafico-previsao',
};

export const CACHE_TTL = {
  RESUMO: 2 * 60 * 1000, // 2 minutos
  GASTOS: 5 * 60 * 1000, // 5 minutos
  SALDOS: 3 * 60 * 1000, // 3 minutos
  GRAFICO: 10 * 60 * 1000, // 10 minutos
};
