import type { ObjetivoUi } from '../types/objetivo.types';
import { INSIGHTS_MOCK } from '../constants/constantesObjetivo';

export const gerarInsightMock = (id: string | number, categoria: string): string => {
  const texto = String(id ?? '');
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }

  const indice = Math.abs(hash) % INSIGHTS_MOCK.length;
  const template = INSIGHTS_MOCK[indice] || INSIGHTS_MOCK[0];
  const nomeCategoria = categoria?.trim() || 'sua categoria';
  return template.replace('{categoria}', nomeCategoria);
};

export const gerarRecomendacao = (objetivo?: ObjetivoUi | null): string => {
  if (!objetivo) return 'Sem recomendações para esta semana.';
  const percentual = Math.round(objetivo.percentualRealizado * 100);

  if (objetivo.tipo === 'LIMITE_GASTO') {
    return `Você já consumiu ${percentual}% do limite de ${objetivo.categoria}. Ajuste pequenos hábitos para manter o objetivo viável.`;
  }

  return `Seu objetivo de ${objetivo.categoria} está em ${percentual}%. Reforce as ações que trazem mais retorno.`;
};
