import type {
  DadosDashboard,
  DadosPrevisaoSaldo,
  GastoCategoria,
  SaldoInstituicao,
} from '../types/dashboard.types';

const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;

const pad2 = (value: number): string => (value < 10 ? `0${value}` : `${value}`);

const formatISODate = (date: Date): string => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const formatLabel = (date: Date): string => {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
};

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const buildMockGastosPorCategoria = (): GastoCategoria[] => {
  const categoriasBase = [
    { id: 1, nome: 'Moradia', icone: 'home', cor: '#95E1D3', valor: 2100 },
    { id: 2, nome: 'Alimentacao', icone: 'restaurant', cor: '#FF6B6B', valor: 920 },
    { id: 3, nome: 'Transporte', icone: 'directions-car', cor: '#4ECDC4', valor: 430 },
  ];

  const total = categoriasBase.reduce((acc, item) => acc + item.valor, 0);

  return categoriasBase.map((item) => ({
    ...item,
    porcentagem: total > 0 ? Math.round((item.valor / total) * 100) : 0,
  }));
};

const buildMockSaldosPorInstituicao = (): SaldoInstituicao[] => {
  const instituicoesBase: Array<Omit<SaldoInstituicao, 'porcentagem'>> = [
    {
      id: 101,
      nome: 'Nubank',
      icone: 'Nu',
      cor: '#820AD1',
      tipo: 'BANCO',
      valor: 3250,
    },
    {
      id: 102,
      nome: 'Inter',
      icone: 'In',
      cor: '#FF7A00',
      tipo: 'BANCO',
      valor: 1890,
    },
    {
      id: 103,
      nome: 'Alelo',
      icone: 'VA',
      cor: '#FF9800',
      tipo: 'VALE',
      valor: 760,
    },
  ];

  const totalPositivo = instituicoesBase
    .filter((item) => item.valor > 0)
    .reduce((acc, item) => acc + item.valor, 0);

  return instituicoesBase.map((item) => ({
    ...item,
    porcentagem: totalPositivo > 0 ? Math.round((item.valor / totalPositivo) * 100) : 0,
  }));
};

const buildMockPrevisaoSaldo = (): DadosPrevisaoSaldo => {
  const hoje = new Date();
  const offsets = [0, 15, 30, 45, 60, 75, 90];
  const saldos = [5900, 5620, 6100, 5880, 6450, 6210, 6720];

  const pontos = offsets.map((offset, index) => {
    const data = addDays(hoje, offset);
    return {
      label: index === 0 ? 'Hoje' : formatLabel(data),
      saldo: saldos[index],
      dataISO: formatISODate(data),
    };
  });

  return {
    pontos,
    saldoAtual: saldos[0],
    saldoFinal: saldos[saldos.length - 1],
    diasFuturos: 90,
  };
};

export const buildMockDashboardData = (): DadosDashboard => {
  const hoje = new Date();
  const mesAtual = `${NOMES_MESES[hoje.getMonth()]}/${hoje.getFullYear()}`;

  const resumo = {
    saldoTotal: 5900,
    receitaTotal: 9800,
    gastoTotal: 3900,
    mesAtual,
  };

  return {
    resumo,
    gastosPorCategoria: buildMockGastosPorCategoria(),
    saldosPorInstituicao: buildMockSaldosPorInstituicao(),
    previsaoSaldo: buildMockPrevisaoSaldo(),
  };
};
