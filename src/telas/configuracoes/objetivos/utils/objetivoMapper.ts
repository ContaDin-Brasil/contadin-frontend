import type { ObjetivoGastoApi } from '../../../../api/types';
import type { ObjetivoUi } from '../types/objetivo.types';
import { calcularPeriodo, calcularStatusPorPercentual, clamp, normalizarPercentual } from './objetivoCalculos';

export const mapearObjetivo = (
  objetivo: ObjetivoGastoApi,
  categoriaMap: Map<string, string>,
  insightsMap?: Map<string, string>,
): ObjetivoUi => {
  const valorAlvo = Number(objetivo.valor) || 0;
  const valorRealizado = Number(objetivo.realizado) || 0;
  const percentualRaw = objetivo.percentual as unknown;
  let percentualRealizado = normalizarPercentual(percentualRaw);
  if ((percentualRaw === null || percentualRaw === undefined) && valorAlvo > 0) {
    percentualRealizado = valorRealizado / valorAlvo;
  }
  const percentualRealizadoClamp = clamp(percentualRealizado, 0, 1);
  const status = calcularStatusPorPercentual(objetivo.tipoObjetivo, percentualRealizado);
  const categoria = categoriaMap.get(String(objetivo.fkCategoria)) || 'Categoria não informada';
  const { percentualPeriodo, diasTotais, diasPassados } = calcularPeriodo(
    objetivo.dataInicio,
    objetivo.dataFim,
    new Date(),
  );
  const isGasto = objetivo.tipoObjetivo === 'LIMITE_GASTO';
  const alertaScore = isGasto
    ? Math.max(0, percentualRealizado - percentualPeriodo)
    : Math.max(0, percentualPeriodo - percentualRealizado);
  const alertaLabel = `${categoria} ${Math.round(percentualRealizado * 100)}% ${
    isGasto ? 'usado' : 'atingido'
  }`;
  const insight = insightsMap?.get(String(objetivo.id)) || '';

  return {
    id: objetivo.id,
    nome: objetivo.nome,
    descricao: objetivo.descricao ?? null,
    tipo: objetivo.tipoObjetivo,
    categoriaId: objetivo.fkCategoria ?? null,
    categoria,
    valorAlvo,
    valorRealizado,
    percentualRealizado,
    percentualRealizadoClamp,
    status,
    statusApi: objetivo.status,
    dataInicio: objetivo.dataInicio,
    dataFim: objetivo.dataFim,
    prioridade: objetivo.prioridade ?? null,
    insight,
    alertaScore,
    alertaLabel,
    diasTotais,
    diasPassados,
  };
};
