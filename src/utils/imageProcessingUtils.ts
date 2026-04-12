/**
 * Utilitário para processamento de imagens
 * Inclui funções para converter, redimensionar e manipular imagens
 */

import { Image as RNImage, ImageURISource } from 'react-native';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImage {
  uri: string;
  base64?: string;
  dimensions: ImageDimensions;
  size: number; // em bytes
  fileName: string;
}

/**
 * Obtém as dimensões de uma imagem a partir da URI
 */
export const getImageDimensions = (imageUri: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    RNImage.getSize(
      imageUri,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Calcula o tamanho aproximado da imagem em base64
 */
export const calculateBase64Size = (base64String: string): number => {
  // Cada caractere em base64 ocupa 1 byte (aproximadamente)
  // Removemos possível prefixo data:image/...base64,
  const cleanBase64 = base64String.split(',').pop() || base64String;
  return Math.ceil((cleanBase64.length * 3) / 4);
};

/**
 * Valida se uma imagem é válida
 */
export const validateImage = async (imageUri: string): Promise<boolean> => {
  try {
    const dimensions = await getImageDimensions(imageUri);
    
    // Validações básicas
    if (dimensions.width < 100 || dimensions.height < 100) {
      console.warn('Imagem muito pequena');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao validar imagem:', error);
    return false;
  }
};

/**
 * Prepara uma imagem para processamento
 * Valida dimensões e tamanho
 */
export const prepareImageForProcessing = async (
  imageUri: string,
  base64?: string
): Promise<ProcessedImage> => {
  try {
    const dimensions = await getImageDimensions(imageUri);
    const fileName = `image_${Date.now()}.jpg`;
    
    const processedImage: ProcessedImage = {
      uri: imageUri,
      base64,
      dimensions,
      size: base64 ? calculateBase64Size(base64) : 0,
      fileName,
    };

    return processedImage;
  } catch (error) {
    throw new Error(`Erro ao preparar imagem: ${error}`);
  }
};

/**
 * Cria uma miniatura de imagem para preview
 * Útil para exibir pré-visualização de imagens capturadas
 */
export const createImageThumbnail = (imageUri: string, maxWidth: number = 200): ImageURISource => {
  return {
    uri: imageUri,
    width: maxWidth,
    height: maxWidth,
  };
};

/**
 * Valida se o base64 de uma imagem é válido
 */
export const isValidBase64Image = (base64String: string): boolean => {
  try {
    // Verifica se tem o prefixo data:image
    if (base64String.includes('data:image')) {
      const parts = base64String.split(',');
      return parts.length === 2 && parts[1].length > 0;
    }
    
    // Se não tem prefixo, apenas valida se é uma string base64 válida
    return /^[A-Za-z0-9+/=]+$/.test(base64String);
  } catch {
    return false;
  }
};

/**
 * Converte um arquivo de imagem para URI de dados (data URL)
 * Útil para salvar/transmitir imagens
 */
export const imageToDataUrl = (base64: string, mimeType: string = 'image/jpeg'): string => {
  // Se já tem prefixo data:, retorna como está
  if (base64.startsWith('data:')) {
    return base64;
  }
  
  return `data:${mimeType};base64,${base64}`;
};

/**
 * Remove o prefixo data URL de um base64
 */
export const removeDataUrlPrefix = (dataUrl: string): string => {
  const parts = dataUrl.split(',');
  return parts.length === 2 ? parts[1] : dataUrl;
};

/**
 * Obtém informações MIME da imagem a partir do base64
 */
export const getMimeTypeFromDataUrl = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/jpeg';
};
