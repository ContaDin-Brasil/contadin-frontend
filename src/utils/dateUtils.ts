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

export const formatarDataLocal = (data: Date): string => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const getDataHojeLocal = (): string => formatarDataLocal(new Date());

export const getFimDoMesLocal = (referencia: Date = new Date()): string => {
  const ultimoDia = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
  return formatarDataLocal(ultimoDia);
};

export const normalizarDataExibicao = (valor: string, fallback: string): string => {
  if (!valor || typeof valor !== 'string') return fallback;
  const isoMatch = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, ano, mes, dia] = isoMatch;
    return `${dia}/${mes}/${ano}`;
  }

  const brMatch = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) return valor;

  return fallback;
};

export const parseDataEntrada = (valor: string): Date | null => {
  if (!valor || typeof valor !== 'string') return null;
  const isoMatch = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const brMatch = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  let dia;
  let mes;
  let ano;

  if (isoMatch) {
    [, ano, mes, dia] = isoMatch;
  } else if (brMatch) {
    [, dia, mes, ano] = brMatch;
  } else {
    return null;
  }

  const diaNum = Number(dia);
  const mesNum = Number(mes);
  const anoNum = Number(ano);

  if (!diaNum || !mesNum || !anoNum) return null;

  const data = new Date(anoNum, mesNum - 1, diaNum);
  if (data.getFullYear() !== anoNum || data.getMonth() !== mesNum - 1 || data.getDate() !== diaNum) {
    return null;
  }

  return data;
};

export const formatarDataISO = (data: Date | null): string | null => {
  if (!data) return null;
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const formatarData = (dataISO?: string | null): string => {
  if (!dataISO) return '--/--/----';
  const data = new Date(`${dataISO}T00:00:00`);
  if (Number.isNaN(data.getTime())) return String(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};
