export const formatarMoeda = (valor: unknown, comSinal = false): string => {
  const numero = Number(valor) || 0;
  const texto = `R$ ${numero.toFixed(0).replace('.', ',')}`;
  return comSinal && numero > 0 ? `+${texto}` : texto;
};

export const formatarMoedaDetalhada = (valor: unknown): string => {
  return `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;
};
