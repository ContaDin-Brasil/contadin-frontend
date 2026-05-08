import type { ObjetivoUi, ResumoObjetivos } from '../types/objetivo.types';
import { gerarRecomendacao } from './objetivoInsights';

export const calcularResumoObjetivos = (objetivos: ObjetivoUi[]): ResumoObjetivos => {
  if (!objetivos.length) {
    return {
      total: 0,
      noRitmo: 0,
      impacto: 0,
      maiorAlerta: '--',
      recomendacao: 'Sem recomendações para esta semana.',
    };
  }

  const impacto = objetivos.reduce((acc, objetivo) => {
    if (objetivo.status === 'meta batida') {
      return acc;
    }

    return acc + Math.max(0, objetivo.valorAlvo - objetivo.valorRealizado);
  }, 0);

  const noRitmo = objetivos.filter((objetivo) => {
    return (
      objetivo.status === 'bom ritmo' ||
      objetivo.status === 'falta pouco' ||
      objetivo.status === 'meta batida' ||
      objetivo.status === 'tranquilo'
    );
  }).length;

  const objetivosAtivos = objetivos.filter((objetivo) => objetivo.status !== 'meta batida');
  const maiorAlerta = (objetivosAtivos.length ? objetivosAtivos : objetivos).reduce((prev, current) => {
    return current.alertaScore > prev.alertaScore ? current : prev;
  }, (objetivosAtivos.length ? objetivosAtivos : objetivos)[0]);

  return {
    total: objetivos.length,
    noRitmo,
    impacto,
    maiorAlerta: maiorAlerta?.alertaLabel || '--',
    recomendacao: maiorAlerta ? gerarRecomendacao(maiorAlerta) : 'Sem recomendações para esta semana.',
  };
};
