import { Alert, Platform } from 'react-native';

/**
 * Tipos de feedback
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Hook para exibir feedback visual (Toast/Alert)
 *
 * Em React Native, usa Alert.alert para plataformas nativas
 * Em Web, simula com console.log + opcionalmente exibiria via toast library
 *
 * @returns Objeto com funções para exibir diferentes tipos de feedback
 *
 * @example
 * const { showSuccess, showError } = useToastFeedback();
 *
 * showSuccess('Transação salva!');
 * showError('Erro ao processar OCR: Imagem inválida');
 */
export const useToastFeedback = () => {
  /**
   * Exibe mensagem de sucesso
   */
  const showSuccess = (message: string, title?: string) => {
    const finalTitle = title || '✅ Sucesso';
    _showToast(finalTitle, message, 'success');
  };

  /**
   * Exibe mensagem de erro
   */
  const showError = (message: string, title?: string) => {
    const finalTitle = title || '❌ Erro';
    _showToast(finalTitle, message, 'error');
  };

  /**
   * Exibe mensagem de informação
   */
  const showInfo = (message: string, title?: string) => {
    const finalTitle = title || 'ℹ️ Informação';
    _showToast(finalTitle, message, 'info');
  };

  /**
   * Exibe mensagem de aviso
   */
  const showWarning = (message: string, title?: string) => {
    const finalTitle = title || '⚠️ Aviso';
    _showToast(finalTitle, message, 'warning');
  };

  /**
   * Exibe toast customizado
   */
  const show = (title: string, message: string, type: ToastType = 'info') => {
    _showToast(title, message, type);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    show,
  };
};

/**
 * Implementação interna de exibição de toast
 */
function _showToast(title: string, message: string, type: ToastType): void {
  if (Platform.OS === 'web') {
    // Em web, log no console e possivelmente exibir em toast library
    const logFn =
      type === 'error' || type === 'warning' ? console.warn : console.log;
    logFn(`[${type.toUpperCase()}] ${title}: ${message}`);
    // TODO: Integrar com toast library (react-hot-toast, react-toastify, etc.)
  } else {
    // Em React Native, usa Alert.alert nativo
    // Nota: Alert no RN não tem suporte a tipo/emoji, então removemos da exibição
    const cleanTitle = title.replace(/[✅❌ℹ️⚠️]/g, '').trim();
    Alert.alert(cleanTitle, message);
  }
}

export default useToastFeedback;
