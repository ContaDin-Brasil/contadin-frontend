import { Audio } from 'expo-av';
import { Alert } from 'react-native';

/**
 * Solicita permissão de microfone ao usuário.
 * Exibe alerta se negada, seguindo o mesmo padrão de cameraUtils.ts.
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  const { status } = await Audio.requestPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permissão negada',
      'Para gravar áudio, permita o acesso ao microfone nas configurações do dispositivo.',
      [{ text: 'OK' }]
    );
    return false;
  }

  return true;
};

/**
 * Configura o modo de áudio para gravação.
 * Deve ser chamado antes de iniciar qualquer Recording.
 * allowsRecordingIOS: true — necessário para gravar no iOS.
 * playsInSilentModeIOS: true — mantém áudio ativo mesmo com silenciador ligado.
 */
export const configureAudioSession = async (): Promise<void> => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
};

/**
 * Reverte o modo de áudio para reprodução normal (após parar a gravação).
 * Boa prática para não interferir em outros sons do app.
 */
export const resetAudioSession = async (): Promise<void> => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: false,
  });
};
