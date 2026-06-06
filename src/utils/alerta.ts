/**
 * Utilitário para mostrar alertas em Web e Mobile
 * 
 * Uso: mostrarAlerta('Título', 'Mensagem')
 */

import { Alert, Platform } from 'react-native';

export const mostrarAlerta = (titulo: string, mensagem: string) => {
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};
