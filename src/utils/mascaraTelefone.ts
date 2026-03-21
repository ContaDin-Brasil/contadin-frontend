/**
 * Formata o texto para exibição como telefone (11) 93843-3432.
 * Extrai só dígitos e limita a 11 caracteres (DDD + 9 dígitos celular).
 * @param {string} texto - Texto digitado (pode conter não-dígitos)
 * @returns {string} String formatada para exibição
 */
export function formatarTelefone(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) {
    return digitos.length ? `(${digitos}` : "";
  }
  if (digitos.length <= 7) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

/**
 * Retorna apenas os dígitos do telefone (para enviar à API).
 * @param {string} texto - Texto formatado ou não
 * @returns {string} Apenas dígitos
 */
export function apenasDigitosTelefone(texto: string): string {
  return texto.replace(/\D/g, "");
}
