import type { ObjetivoTipoApi } from '../../../../api/types';
import type { ObjetivoStatusLabel } from '../types/objetivo.types';

const DIA_EM_MS = 24 * 60 * 60 * 1000;

export const clamp = (valor: number, min = 0, max = 1): number => {
  return Math.min(max, Math.max(min, valor));
};

export const normalizarPercentual = (valor: unknown): number => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 0;
  return numero > 1 ? numero / 100 : numero;
};

export const calcularStatusPorPercentual = (
  tipo: ObjetivoTipoApi,
  percentual: number,
): ObjetivoStatusLabel => {
  const valor = clamp(percentual, 0, 1);

  if (tipo === 'AUMENTO_RECEITA') {
    if (valor <= 0.25) return 'no caminho';
    if (valor <= 0.5) return 'bom ritmo';
    if (valor <= 0.75) return 'falta pouco';
    return 'meta batida';
  }

  if (valor <= 0.25) return 'tranquilo';
  if (valor <= 0.5) return 'atenção';
  if (valor <= 0.75) return 'cuidado';
  return 'acima do combinado';
};

export const calcularPeriodo = (dataInicio: string, dataFim: string, referencia: Date) => {
  const inicio = new Date(`${dataInicio}T00:00:00`);
  const fim = new Date(`${dataFim}T23:59:59`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    return { percentualPeriodo: 0, diasTotais: 0, diasPassados: 0 };
  }

  const totalMs = Math.max(fim.getTime() - inicio.getTime(), DIA_EM_MS);
  const passadosMs = Math.min(Math.max(referencia.getTime() - inicio.getTime(), 0), totalMs);
  const percentualPeriodo = clamp(passadosMs / totalMs);
  const diasTotais = Math.max(1, Math.ceil(totalMs / DIA_EM_MS));
  const diasPassados = Math.min(diasTotais, Math.ceil(passadosMs / DIA_EM_MS));

  return { percentualPeriodo, diasTotais, diasPassados };
};
