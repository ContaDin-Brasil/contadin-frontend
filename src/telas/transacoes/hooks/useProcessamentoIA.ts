import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AISuggestion, ProcessingType } from '../types/transacao.types';

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
 * Hook customizado para gerenciar o processamento de IA/OCR
 */
export const useProcessamentoIA = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<ProcessingType | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  
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
   * Simula o processamento OCR de uma foto
   */
  const handlePhotoOCR = () => {
    setProcessingType('photo');
    setIsProcessing(true);
    
    // Simular processamento de OCR
    setTimeout(() => {
      setAiSuggestion({
        descricao: 'Compra no Supermercado Extra',
        valor: 'R$ 145,80',
        categoria: 'Alimentação',
        tipo: 'GASTO',
        instituicao: 'Nubank',
        data: getTodayDate()
      });
      setIsProcessing(false);
    }, 2500);
  };

  /**
   * Simula o processamento de transcrição de áudio
   */
  const handleAudioInput = () => {
    setProcessingType('audio');
    setIsProcessing(true);
    
    // Simular processamento de áudio
    setTimeout(() => {
      setAiSuggestion({
        descricao: 'Salário mensal',
        valor: 'R$ 5.000,00',
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
  };

  return {
    isProcessing,
    processingType,
    aiSuggestion,
    pulseAnim,
    handlePhotoOCR,
    handleAudioInput,
    dismissAISuggestion,
  };
};
