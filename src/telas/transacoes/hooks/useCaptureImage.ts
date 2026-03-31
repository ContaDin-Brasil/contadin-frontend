/**
 * Hook para gerenciar a captura de imagens e vídeos
 * Fornece interface simples para câmera, galeria e lógica de processamento
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { openCamera, openGallery, openImagePicker, ImageData } from '../../../utils/cameraUtils';

export interface CapturedImage {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
  fileName?: string;
  capturedAt: string;
}

/**
 * Estados do hook
 */
interface UseCaptureImageState {
  isLoading: boolean;
  capturedImage: CapturedImage | null;
  error: string | null;
}

/**
 * Hook para gerenciar captura de imagens
 */
export const useCaptureImage = () => {
  const [state, setState] = useState<UseCaptureImageState>({
    isLoading: false,
    capturedImage: null,
    error: null,
  });

  /**
   * Abre a câmera e captura uma foto
   */
  const captureFromCamera = async (includeBase64: boolean = false): Promise<CapturedImage | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const imageData = await openCamera(includeBase64);
      
      if (imageData) {
        const capturedImage: CapturedImage = {
          ...imageData,
          capturedAt: new Date().toISOString(),
        };
        setState(prev => ({
          ...prev,
          capturedImage,
          isLoading: false,
        }));
        return capturedImage;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao capturar foto';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return null;
    }
  };

  /**
   * Abre a galeria e seleciona uma imagem
   */
  const selectFromGallery = async (includeBase64: boolean = false): Promise<CapturedImage | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const imageData = await openGallery(includeBase64);
      
      if (imageData) {
        const capturedImage: CapturedImage = {
          ...imageData,
          capturedAt: new Date().toISOString(),
        };
        setState(prev => ({
          ...prev,
          capturedImage,
          isLoading: false,
        }));
        return capturedImage;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao selecionar imagem';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return null;
    }
  };

  /**
   * Abre um modal para o usuário escolher câmera ou galeria
   */
  const pickImage = async (includeBase64: boolean = false): Promise<CapturedImage | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const imageData = await openImagePicker(includeBase64);
      
      if (imageData) {
        const capturedImage: CapturedImage = {
          ...imageData,
          capturedAt: new Date().toISOString(),
        };
        setState(prev => ({
          ...prev,
          capturedImage,
          isLoading: false,
        }));
        return capturedImage;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao selecionar imagem';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return null;
    }
  };

  /**
   * Limpa a imagem capturada
   */
  const clearImage = () => {
    setState({
      isLoading: false,
      capturedImage: null,
      error: null,
    });
  };

  /**
   * Limpa o erro
   */
  const clearError = () => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  return {
    // Estado
    isLoading: state.isLoading,
    capturedImage: state.capturedImage,
    error: state.error,
    
    // Métodos
    captureFromCamera,
    selectFromGallery,
    pickImage,
    clearImage,
    clearError,
  };
};
