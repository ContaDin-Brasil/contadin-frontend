/**
 * Utilitários para formatação de valores monetários
 */

/**
 * Remove todos os caracteres não numéricos de uma string
 * @param valor - String com o valor
 * @returns String apenas com números
 */
export const apenasNumeros = (valor: string): string => {
  return valor.replace(/\D/g, '');
};

/**
 * Remove símbolos de moeda e formatação de uma string
 * Exemplos: 
 * - "R$ 1.234,56" -> "1234.56"
 * - "1.234,56" -> "1234.56"
 * - "R$ 1234.56" -> "1234.56"
 * @param valor - String com o valor formatado
 * @returns String numérica limpa
 */
export const limparValorMonetario = (valor: string): string => {
  if (!valor) return '';
  
  // Remove R$, espaços e pontos (separadores de milhar)
  let limpo = valor
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '');
  
  // Converte vírgula para ponto (separador decimal)
  limpo = limpo.replace(',', '.');
  
  return limpo;
};

/**
 * Formata um valor numérico para o padrão brasileiro de moeda
 * Aplica máscara automaticamente enquanto digita
 * Exemplos:
 * - 12345 -> "123,45"
 * - 1234567 -> "12.345,67"
 * - 100 -> "1,00"
 * 
 * @param valor - String com o valor a ser formatado
 * @returns String formatada com vírgula decimal e pontos de milhar
 */
export const formatarValorMonetario = (valor: string): string => {
  console.log('  🔧 [FORMATAR] Entrada:', valor);
  
  // Remove tudo que não é número
  const apenasDigitos = apenasNumeros(valor);
  console.log('  🔧 [FORMATAR] Apenas dígitos:', apenasDigitos);
  
  if (!apenasDigitos) return '';
  
  // Converte para número e divide por 100 (centavos)
  const numeroFormatado = parseInt(apenasDigitos) / 100;
  console.log('  🔧 [FORMATAR] Número:', numeroFormatado);
  
  // Formata no padrão brasileiro
  const resultado = numeroFormatado.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  console.log('  🔧 [FORMATAR] Saída:', resultado);
  
  return resultado;
};

/**
 * Converte valor formatado brasileiro para número
 * Exemplos:
 * - "1.234,56" -> 1234.56
 * - "123,45" -> 123.45
 * - "R$ 1.234,56" -> 1234.56
 * 
 * @param valor - String com valor formatado
 * @returns Número decimal
 */
export const converterParaNumero = (valor: string): number => {
  const limpo = limparValorMonetario(valor);
  return parseFloat(limpo) || 0;
};

/**
 * Formata um número para exibição com R$
 * @param valor - Número a ser formatado
 * @returns String formatada com "R$ X.XXX,XX"
 */
export const formatarComMoeda = (valor: number): string => {
  return `R$ ${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
