/**
 * Utilitário para gerenciar acesso à câmera e galeria
 * Usa expo-image-picker para proporcionar acesso simplificado
 */

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

/**
 * Dimensão máxima (largura ou altura) permitida antes de enviar para OCR.
 * Fotos de celular moderno (12MP+) são reduzidas para ~200-400KB,
 * evitando travamento no upload via React Native FormData.
 */
const MAX_IMAGE_DIMENSION = 1280;

/**
 * Redimensiona a imagem para no máximo MAX_IMAGE_DIMENSION px no lado maior,
 * mantendo o aspect ratio. Retorna a URI do arquivo redimensionado e,
 * opcionalmente, o base64 correspondente.
 */
const resizeImageIfNeeded = async (
  uri: string,
  width: number,
  height: number,
  includeBase64: boolean
): Promise<{ uri: string; base64?: string; width: number; height: number }> => {
  const needsResize = width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION;

  const actions: ImageManipulator.Action[] = [];

  if (needsResize) {
    if (width >= height) {
      actions.push({ resize: { width: MAX_IMAGE_DIMENSION } });
    } else {
      actions.push({ resize: { height: MAX_IMAGE_DIMENSION } });
    }
  }

  // Sempre passa pelo manipulator quando base64 é necessário,
  // garantindo que uri e base64 correspondam ao mesmo arquivo
  if (needsResize || includeBase64) {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: includeBase64,
      }
    );
    return {
      uri: result.uri,
      base64: result.base64 ?? undefined,
      width: result.width,
      height: result.height,
    };
  }

  return { uri, width, height };
};

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
      const resized = await resizeImageIfNeeded(
        asset.uri,
        asset.width ?? MAX_IMAGE_DIMENSION,
        asset.height ?? MAX_IMAGE_DIMENSION,
        includeBase64
      );
      return {
        uri: resized.uri,
        base64: resized.base64,
        width: resized.width,
        height: resized.height,
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
      const resized = await resizeImageIfNeeded(
        asset.uri,
        asset.width ?? MAX_IMAGE_DIMENSION,
        asset.height ?? MAX_IMAGE_DIMENSION,
        includeBase64
      );
      return {
        uri: resized.uri,
        base64: resized.base64,
        width: resized.width,
        height: resized.height,
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
