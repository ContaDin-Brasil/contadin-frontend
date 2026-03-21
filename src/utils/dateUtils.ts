const NOMES_MESES: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const formatarMesAno = (mesAno?: string | null): string => {
  if (!mesAno) return '';

  const matchBR = mesAno.match(/^(\d{2})\/(\d{4})$/);
  if (matchBR) {
    const mes = parseInt(matchBR[1], 10) - 1;
    return `${NOMES_MESES[mes]}/${matchBR[2]}`;
  }

  const matchISO = mesAno.match(/^(\d{4})-(\d{2})$/);
  if (matchISO) {
    const mes = parseInt(matchISO[2], 10) - 1;
    return `${NOMES_MESES[mes]}/${matchISO[1]}`;
  }

  return mesAno;
};


export const normalizarLabelHoje = (label: string, dataISO: string): string => {
  const hoje = new Date();
  const ano  = hoje.getFullYear();
  const mes  = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia  = String(hoje.getDate()).padStart(2, '0');
  const hojeISO = `${ano}-${mes}-${dia}`;
  return dataISO === hojeISO ? 'Hoje' : label;
};
