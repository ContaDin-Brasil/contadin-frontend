/**
 * Paleta de cores global do aplicativo ContaDin
 * Centraliza todas as cores utilizadas para facilitar manutenção e padronização
 */

export const COLORS = {
  // Cores Primárias (Azul)
  primary: '#0066FF',           // Azul principal - botões, destaques
  primaryLight: '#5BA3FF',      // Azul claro - ícones, elementos secundários
  primaryLighter: '#B8DBFF',    // Azul bem claro - backgrounds
  primaryDark: '#0052CC',       // Azul escuro - hover states
  
  // Cores Secundárias
  secondary: '#569FFE',         // Azul claro (headers, destaques)
  secondaryLight: '#4A9EFF',    // Azul luz adicional (botões)
  secondaryLighter: '#E6F0FF',  // Azul muito claro (backgrounds)
  secondaryBorder: '#D3E4FF',   // Borda azul clara (cards)
  
  // Cores de Status
  success: '#00C853',           // Verde - receitas, sucesso
  error: '#E31C23',             // Vermelho - despesas, erros
  warning: '#FF9800',           // Laranja - avisos
  info: '#2196F3',              // Azul informação
  
  // Cores Especiais
  tooltip: '#2D85F8',           // Azul tooltip
  tooltipBg: '#EAF3FF',         // Background tooltip
  tooltipText: '#355070',       // Texto tooltip
  cardBg: '#F7F9FF',            // Background de cards
  
  // Cinzas e Neutros
  background: '#F5F5F5',        // Background principal
  backgroundLight: '#FAFAFA',   // Background claro
  backgroundDark: '#E8E8E8',    // Background escuro
  
  border: '#E0E0E0',            // Bordas padrão
  borderLight: '#F0F0F0',       // Bordas claras
  borderDark: '#D0D0D0',        // Bordas escuras
  
  // Textos
  textPrimary: '#333333',       // Texto principal
  textSecondary: '#666666',     // Texto secundário
  textTertiary: '#999999',      // Texto terciário
  textDisabled: '#CCCCCC',      // Texto desabilitado
  textDark: '#1A1A1A',          // Texto escuro suave
  textLight: '#AAAAAA',         // Texto claro
  textLighter: '#BBBBBB',       // Texto muito claro
  textPale: '#555555',          // Texto pálido
  
  // Brancos e Pretos
  white: '#FFFFFF',
  black: '#000000',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)', // Fundo de modais
  
  // Especiais
  whatsapp: '#25D366',          // Verde WhatsApp
};

/**
 * Paleta de cores para instituições bancárias
 */
export const BANK_COLORS = {
  santander: '#E31C23',
  nubank: '#820AD1',
  itau: '#FF6600',
  bradesco: '#CC092F',
  c6bank: '#000000',
  banco_do_brasil: '#FFED00',
  caixa: '#0066A1',
  inter: '#FF6600',
  bradesco_2: '#00AB63',
  bradesco_3: '#00D9E1',
  bradesco_4: '#21C25E',
  bradesco_5: '#009EE3',
  otro: '#666666',
};

/**
 * Paleta de cores para vales alimentação
 */
export const VOUCHER_COLORS = {
  flash: '#FF1493',
  alelo: '#7FBA00',
  vr: '#E34234',
  sodexo: '#ED1C24',
  ticket: '#0095DA',
};

/**
 * Paleta de cores para categorias de transações
 */
export const CATEGORY_COLORS = [
  '#FF6B6B',  // Alimentação - Vermelho
  '#4ECDC4',  // Transporte/Compras - Teal
  '#45B7D1',  // Categoria - Azul claro
  '#FFA07A',  // Categoria - Salmão
  '#98D8C8',  // Categoria - Verde claro
  '#F7DC6F',  // Categoria - Amarelo
  '#BB8FCE',  // Categoria - Roxo
  '#85C1E2',  // Categoria - Azul
  '#F8B739',  // Categoria - Dourado
  '#52B788',  // Categoria - Verde
  '#E63946',  // Categoria - Vermelho
  '#457B9D',  // Categoria - Azul escuro
  '#A8DADC',  // Categoria - Azul claro
  '#F1FAEE',  // Categoria - Off-white
  '#E76F51',  // Categoria - Coral
  '#2A9D8F',  // Categoria - Verde escuro
  '#264653',  // Categoria - Cinza escuro
  '#E9C46A',  // Categoria - Amarelo queimado
  '#95E1D3',  // Moradia - Verde claro
  '#51CF66',  // Salário - Verde receita
  '#9C27B0',  // Compras - Roxo
  '#00BCD4',  // Categoria - Ciano
  '#2196F3',  // Educação - Azul
  '#FFD93D',  // Lazer - Amarelo
];

/**
 * Utilitário para adicionar opacidade a uma cor hex
 * @param color Cor em hexadecimal (ex: '#0066FF')
 * @param opacity Opacidade de 0 a 100 (ex: 20 para 20%)
 * @returns Cor em formato rgba
 */
export const addOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

export default COLORS;
