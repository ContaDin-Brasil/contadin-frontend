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
  
  // Cores de Status
  success: '#00C853',           // Verde - receitas, sucesso
  error: '#E31C23',             // Vermelho - despesas, erros
  warning: '#FF9800',           // Laranja - avisos
  info: '#2196F3',              // Azul informação
  
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
  
  // Brancos e Pretos
  white: '#FFFFFF',
  black: '#000000',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)', // Fundo de modais
  
  // Especiais
  whatsapp: '#25D366',          // Verde WhatsApp
};

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
