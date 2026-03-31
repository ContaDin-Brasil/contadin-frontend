import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AISuggestion, ProcessingType } from '../types/transacao.types';
import { useCaptureImage, CapturedImage } from './useCaptureImage';

/**
 * Obtém a data de hoje no formato DD/MM/YYYY
 */
const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Hook customizado para gerenciar o processamento de IA/Sugestões
 * Gerencia captura de imagens e geração de sugestões
 */
export const useProcessamentoIA = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<ProcessingType | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  
  // Hook para capturar imagens
  const captureImage = useCaptureImage();
  
  // Animação do loading
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isProcessing, pulseAnim]);

  /**
   * Captura foto para gerar sugestão
   */
  const handlePhotoCapture = async () => {
    setProcessingType('photo');
    setIsProcessing(true);

    try {
      // Chama o hook para capturar imagem (abre modal de escolha câmera/galeria)
      const imageData = await captureImage.pickImage(true); // true = incluir base64

      if (imageData) {
        setCapturedImage(imageData);
        
        // Gera sugestão mock com dados fictícios
        setTimeout(() => {
          setAiSuggestion({
            descricao: 'Compra no Supermercado Extra',
            valor: '145,80',
            categoria: 'Alimentação',
            tipo: 'GASTO',
            instituicao: 'Nubank',
            data: getTodayDate()
          });
          setIsProcessing(false);
        }, 2500);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao processar foto:', error);
      setIsProcessing(false);
    }
  };

  /**
   * Gera sugestão mock a partir de áudio
   */
  const handleAudioInput = () => {
    setProcessingType('audio');
    setIsProcessing(true);
    
    // Simular processamento de áudio
    setTimeout(() => {
      setAiSuggestion({
        descricao: 'Salário mensal',
        valor: '5.000,00',  // Valor já formatado sem R$ (será processado pelo input)
        categoria: 'Salário',
        tipo: 'RECEITA',
        instituicao: 'Santander',
        data: getTodayDate()
      });
      setIsProcessing(false);
    }, 3000);
  };

  /**
   * Descarta a sugestão da IA
   */
  const dismissAISuggestion = () => {
    setAiSuggestion(null);
    setCapturedImage(null);
    captureImage.clearImage();
  };

  /**
   * Captura foto da câmera
   */
  const captureFromCamera = async () => {
    setProcessingType('photo');
    setIsProcessing(true);

    try {
      const imageData = await captureImage.captureFromCamera(true); // true = incluir base64

      if (imageData) {
        setCapturedImage(imageData);
        
        // Gera sugestão mock com dados fictícios
        setTimeout(() => {
          setAiSuggestion({
            descricao: 'Compra no Supermercado Extra',
            valor: '145,80',
            categoria: 'Alimentação',
            tipo: 'GASTO',
            instituicao: 'Nubank',
            data: getTodayDate()
          });
          setIsProcessing(false);
        }, 2500);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      setIsProcessing(false);
    }
  };

  /**
   * Seleciona foto da galeria
   */
  const captureFromGallery = async () => {
    setProcessingType('photo');
    setIsProcessing(true);

    try {
      const imageData = await captureImage.selectFromGallery(true); // true = incluir base64

      if (imageData) {
        setCapturedImage(imageData);
        
        // Gera sugestão mock com dados fictícios
        setTimeout(() => {
          setAiSuggestion({
            descricao: 'Compra no Supermercado Extra',
            valor: '145,80',
            categoria: 'Alimentação',
            tipo: 'GASTO',
            instituicao: 'Nubank',
            data: getTodayDate()
          });
          setIsProcessing(false);
        }, 2500);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processingType,
    aiSuggestion,
    capturedImage,
    pulseAnim,
    handlePhotoCapture,
    handleAudioInput,
    dismissAISuggestion,
    captureFromCamera,
    captureFromGallery,
  };
};
