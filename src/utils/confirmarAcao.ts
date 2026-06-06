import { Alert, Platform } from 'react-native';

type EstiloConfirmacao = 'default' | 'cancel' | 'destructive';

interface ConfirmarAcaoParams {
  titulo: string;
  mensagem: string;
  onConfirmar: () => void | Promise<void>;
  onCancelar?: () => void;
  textoConfirmar?: string;
  textoCancelar?: string;
  estiloConfirmar?: EstiloConfirmacao;
  cancelable?: boolean;
}

export const confirmarAcao = ({
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  estiloConfirmar = 'destructive',
  cancelable = true,
}: ConfirmarAcaoParams): void => {
  if (Platform.OS === 'web') {
    const textoConfirmacao = `${titulo}\n\n${mensagem}`;
    const confirmou = globalThis.confirm?.(textoConfirmacao) ?? false;

    if (confirmou) {
      void Promise.resolve(onConfirmar());
    } else {
      onCancelar?.();
    }

    return;
  }

  Alert.alert(
    titulo,
    mensagem,
    [
      {
        text: textoCancelar,
        style: 'cancel',
        onPress: onCancelar,
      },
      {
        text: textoConfirmar,
        style: estiloConfirmar,
        onPress: () => {
          void Promise.resolve(onConfirmar());
        },
      },
    ],
    { cancelable },
  );
};
