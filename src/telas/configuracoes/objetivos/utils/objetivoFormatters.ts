import { PRIORIDADE_LABELS } from '../constants/constantesObjetivo';

export const formatarPrioridade = (valor?: string | null): string => {
  if (!valor) return 'média';
  if (Object.prototype.hasOwnProperty.call(PRIORIDADE_LABELS, valor)) {
    return PRIORIDADE_LABELS[valor as keyof typeof PRIORIDADE_LABELS];
  }
  return 'média';
};
