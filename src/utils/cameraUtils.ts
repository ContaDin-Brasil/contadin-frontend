/**
 * Utilitário para gerenciar acesso à câmera e galeria
 * Usa expo-image-picker para proporcionar acesso simplificado
 */

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface ImageData {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
  fileName?: string;
}

/**
 * Solicita permissão para acessar a câmera
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão de câmera:', error);
    Alert.alert('Erro', 'Não foi possível solicitar permissão da câmera');
    return false;
  }
};

/**
 * Solicita permissão para acessar a galeria
 */
export const requestGalleryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão de galeria:', error);
    Alert.alert('Erro', 'Não foi possível solicitar permissão de galeria');
    return false;
  }
};

/**
 * Abre a câmera para capturar uma foto
 * @param includeBase64 - Se deve incluir base64 na resposta
 */
export const openCamera = async (includeBase64: boolean = false): Promise<ImageData | null> => {
  try {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permissão recusada',
        'É necessário permitir acesso à câmera. Você pode alterar isso nas configurações do app.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: false,
      quality: 0.8,
      base64: includeBase64,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        base64: asset.base64,
        width: asset.width,
        height: asset.height,
        fileName: `photo_${Date.now()}.jpg`,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao abrir câmera:', error);
    Alert.alert('Erro', 'Não foi possível abrir a câmera');
    return null;
  }
};

/**
 * Abre a galeria para selecionar uma imagem
 * @param includeBase64 - Se deve incluir base64 na resposta
 */
export const openGallery = async (includeBase64: boolean = false): Promise<ImageData | null> => {
  try {
    const hasPermission = await requestGalleryPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permissão recusada',
        'É necessário permitir acesso à galeria. Você pode alterar isso nas configurações do app.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: false,
      quality: 0.8,
      base64: includeBase64,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        base64: asset.base64,
        width: asset.width,
        height: asset.height,
        fileName: `gallery_${Date.now()}.jpg`,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao abrir galeria:', error);
    Alert.alert('Erro', 'Não foi possível abrir a galeria');
    return null;
  }
};

/**
 * Abre um modal para o usuário escolher entre câmera ou galeria
 */
export const openImagePicker = async (includeBase64: boolean = false): Promise<ImageData | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Selecionar Imagem',
      'Como você deseja adicionar a imagem?',
      [
        {
          text: 'Câmera',
          onPress: async () => {
            const imageData = await openCamera(includeBase64);
            resolve(imageData);
          },
        },
        {
          text: 'Galeria',
          onPress: async () => {
            const imageData = await openGallery(includeBase64);
            resolve(imageData);
          },
        },
        {
          text: 'Cancelar',
          onPress: () => resolve(null),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  });
};
