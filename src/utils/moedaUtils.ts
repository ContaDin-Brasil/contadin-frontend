export const formatarMoeda = (valor: unknown, comSinal = false): string => {
  const numero = Number(valor) || 0;
  const texto = `R$ ${numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  return comSinal && numero > 0 ? `+${texto}` : texto;
};

export const formatarMoedaDetalhada = (valor: unknown): string => {
  const numero = Number(valor) || 0;
  return `R$ ${numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
