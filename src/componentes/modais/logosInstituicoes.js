/**
 * Mapeamento de logos das instituições
 * Usar nome da instituição para buscar o logo correspondente
 * 
 * IMPORTANTE: Todos os require() devem ser estáticos (Metro Bundler)
 * Logos estão em: assets/logos/instituicoes/
 */

export const logosInstituicoes = {
  // Bancos
  'santander': require('../../../assets/logos/instituicoes/santander.png'),
  'nubank': require('../../../assets/logos/instituicoes/nubank.png'),
  'itaú': require('../../../assets/logos/instituicoes/itau.png'),
  'itau': require('../../../assets/logos/instituicoes/itau.png'),
  'inter': require('../../../assets/logos/instituicoes/inter.png'),
  'bradesco': require('../../../assets/logos/instituicoes/bradesco.png'),
  'banco do brasil': require('../../../assets/logos/instituicoes/banco-do-brasil.png'),
  'caixa': require('../../../assets/logos/instituicoes/caixa.png'),
  'c6 bank': require('../../../assets/logos/instituicoes/c6-bank.png'),
  'next': require('../../../assets/logos/instituicoes/next.png'),
  'neon': require('../../../assets/logos/instituicoes/neon.png'),
  'picpay': require('../../../assets/logos/instituicoes/picpay.png'),
  'mercado pago': require('../../../assets/logos/instituicoes/mercado-pago.png'),
  
  // Vales
  'vale refeição': require('../../../assets/logos/instituicoes/vr-beneficios.png'),
  'vale alimentação': require('../../../assets/logos/instituicoes/vr-beneficios.png'),
  'alelo': require('../../../assets/logos/instituicoes/alelo.png'),
  'sodexo': require('../../../assets/logos/instituicoes/sodexo.png'),
  'ticket': require('../../../assets/logos/instituicoes/ticket.png'),
  'flash': require('../../../assets/logos/instituicoes/flash.png'),
  'vr benefícios': require('../../../assets/logos/instituicoes/vr-beneficios.png'),
  'ben visa vale': require('../../../assets/logos/instituicoes/ben-visa-vale.png'),
};

/**
 * Busca logo da instituição pelo nome
 * @param {string} nome - Nome da instituição
 * @returns {*} - Logo require() ou null se não encontrado
 */
export const getLogoByName = (nome) => {
  if (!nome) return null;
  const key = nome.toLowerCase().trim();
  return logosInstituicoes[key] || null;
};
