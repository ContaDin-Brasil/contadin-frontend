/**
 * Wrapper melhorado de confirmarAcao com suporte a loading
 * 
 * Uso:
 * 
 * const { isLoading, handleDelete } = useConfirmarAcaoComLoading(
 *   async () => {
 *     await usuarioService.deletar(id);
 *   },
 *   { titulo: 'Excluir Usuário', mensagem: '...' }
 * );
 * 
 * <Button onPress={handleDelete} disabled={isLoading} />
 */

import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { confirmarAcao } from './confirmarAcao';
import { mostrarAlerta } from './alerta';

interface UseConfirmarAcaoComLoadingParams {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onSucesso?: () => void;
  onErro?: (error: Error) => void;
  mostrarAlertaSucesso?: boolean;
  textoAlertaSucesso?: string;
}

/**
 * Hook para executar ação com confirmação + loading
 */
export const useConfirmarAcaoComLoading = (
  onConfirm: () => Promise<void>,
  config: UseConfirmarAcaoComLoadingParams
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    confirmarAcao({
      titulo: config.titulo,
      mensagem: config.mensagem,
      textoConfirmar: config.textoConfirmar || 'Confirmar',
      textoCancelar: config.textoCancelar || 'Cancelar',
      onConfirmar: async () => {
        setIsLoading(true);
        try {
          await onConfirm();
          
          if (config.mostrarAlertaSucesso !== false) {
            mostrarAlerta(
              'Sucesso',
              config.textoAlertaSucesso || 'Ação realizada com sucesso!'
            );
          }
          
          config.onSucesso?.();
        } catch (error) {
          const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido';
          mostrarAlerta('Erro', mensagemErro);
          config.onErro?.(error as Error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return { isLoading, handleDelete };
};
