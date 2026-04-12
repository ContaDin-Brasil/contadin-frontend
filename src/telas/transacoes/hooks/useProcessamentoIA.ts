import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AISuggestion, ProcessingType } from '../types/transacao.types';
import { useCaptureImage, CapturedImage } from './useCaptureImage';
import { useToastFeedback } from './useToastFeedback';
import ocrService from '../../../api/services/ocrService';
import {
  mapOCRToAISuggestion,
  type MappedOCRResult,
} from '../utils/mapOCRToAISuggestion';

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
  
  // Metadados do OCR (FK's e ID's para referência posterior)
  const [ocrMetadata, setOcrMetadata] = useState<Partial<MappedOCRResult>>({});
  
  // Erro durante processamento OCR (para permitir retry)
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  // Progresso de upload (0-100%)
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Mensagem de status detalhada
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Hook para capturar imagens
  const captureImage = useCaptureImage();
  
  // Hook para feedback visual
  const { showError, showSuccess } = useToastFeedback();
  
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
   * Captura foto para gerar sugestão via OCR
   */
  const handlePhotoCapture = async () => {
    setProcessingType('photo');
    setIsProcessing(true);
    setProcessingError(null);

    try {
      // Chama o hook para capturar imagem (abre modal de escolha câmera/galeria)
      const imageData = await captureImage.pickImage(true); // true = incluir base64

      if (imageData) {
        setCapturedImage(imageData);
        await _processImageWithOCR(imageData);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erro ao capturar foto';
      setProcessingError(errorMsg);
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
    setOcrMetadata({});
    setProcessingError(null);
    captureImage.clearImage();
  };

  /**
   * Tenta processar a imagem capturada novamente (retry)
   */
  const retryOCRProcessing = async () => {
    if (!capturedImage) {
      showError('Nenhuma imagem capturada. Tente capturar novamente.');
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);
    await _processImageWithOCR(capturedImage);
  };

  /**
   * Função privada para processar imagem com OCR
   * Chama o serviço OCR e mapeia resposta para AISuggestion
   */
  const _processImageWithOCR = async (imageData: CapturedImage) => {
    try {
      setUploadProgress(0);
      setStatusMessage('Preparando envio...');

      // Callback para rastrear progresso
      const handleProgress = (progress: {
        loaded: number;
        total: number;
        percentage: number;
        status: 'uploading' | 'processing' | 'done' | 'error';
        message?: string;
      }) => {
        setUploadProgress(progress.percentage);
        setStatusMessage(progress.message || null);
        console.log(
          `[OCR Progress] ${progress.status}: ${progress.percentage}% - ${progress.message}`
        );
      };

      // Chama serviço OCR com callback de progresso
      const ocrResult = await ocrService.scanTransacaoFromImage(
        imageData,
        'base64', // Usa base64 como método padrão
        handleProgress,
        60000 // Timeout: 30 segundos
      );

      if (!ocrResult.success) {
        // Erro no OCR
        const errorMessage =
          ocrResult.error ||
          'Erro desconhecido ao processar imagem. Tente novamente.';
        showError(errorMessage, 'OCR Falhou');
        setProcessingError(errorMessage);
        setUploadProgress(0);
        
        // Exibir timing mesmo em erro
        if (ocrResult.totalTimeMs) {
          console.log(
            `⏱️ Tempo total: ${ocrResult.totalTimeMs}ms (upload: ${ocrResult.uploadTimeMs}ms)`
          );
        }
        setIsProcessing(false);
        return;
      }

      if (!ocrResult.ocr) {
        showError('Resposta OCR inválida. Tente novamente.', 'Erro de Resposta');
        setProcessingError('Resposta OCR vazia');
        setUploadProgress(0);
        setIsProcessing(false);
        return;
      }

      // Mapeia resposta OCR para AISuggestion
      const mappedResult = mapOCRToAISuggestion(ocrResult.ocr);

      // Armazena metadados para uso posterior (ao salvar transação)
      setOcrMetadata({
        fkInstituicao: mappedResult.fkInstituicao,
        fkCategoria: mappedResult.fkCategoria,
        idInstituicaoExistente: mappedResult.idInstituicaoExistente,
      });

      // Exibe a sugestão
      setAiSuggestion(mappedResult.aiSuggestion);
      
      // Feedback detalhado com timing
      const timingMsg = ocrResult.totalTimeMs
        ? `em ${ocrResult.totalTimeMs}ms (upload: ${ocrResult.uploadTimeMs}ms, processamento: ${ocrResult.processingTimeMs}ms)`
        : '';
      showSuccess(
        `Transação extraída com sucesso!\n${timingMsg}`,
        '✅ OCR Completo'
      );
      
      console.log(
        `✨ OCR sucesso: ${mappedResult.aiSuggestion.descricao}`
      );
      console.log(
        `⏱️ Timing: Upload=${ocrResult.uploadTimeMs}ms, Processamento=${ocrResult.processingTimeMs}ms, Total=${ocrResult.totalTimeMs}ms`
      );
      
      setUploadProgress(0);
      setStatusMessage(null);
      setIsProcessing(false);
    } catch (error) {
      console.error('❌ Erro ao processar OCR:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao processar imagem com OCR';
      showError(errorMessage, 'Erro no Processamento');
      setProcessingError(errorMessage);
      setUploadProgress(0);
      setStatusMessage(null);
      setIsProcessing(false);
    }
  };

  /**
   * Captura foto da câmera e processa com OCR
   */
  const captureFromCamera = async () => {
    setProcessingType('photo');
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const imageData = await captureImage.captureFromCamera(true); // true = incluir base64

      if (imageData) {
        setCapturedImage(imageData);
        await _processImageWithOCR(imageData);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erro ao capturar foto';
      setProcessingError(errorMsg);
      setIsProcessing(false);
    }
  };

  /**
   * Seleciona foto da galeria e processa com OCR
   */
  const captureFromGallery = async () => {
    setProcessingType('photo');
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const imageData = await captureImage.selectFromGallery(true); // true = incluir base64

      if (imageData) {
        setCapturedImage(imageData);
        await _processImageWithOCR(imageData);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erro ao selecionar foto';
      setProcessingError(errorMsg);
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processingType,
    aiSuggestion,
    capturedImage,
    pulseAnim,
    processingError,
    ocrMetadata,
    uploadProgress,
    statusMessage,
    handlePhotoCapture,
    handleAudioInput,
    dismissAISuggestion,
    captureFromCamera,
    captureFromGallery,
    retryOCRProcessing,
  };
};
