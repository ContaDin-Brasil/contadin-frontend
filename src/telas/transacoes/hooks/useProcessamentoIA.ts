import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Audio } from 'expo-av';
import { AISuggestion, ProcessingType } from '../types/transacao.types';
import { useCaptureImage, CapturedImage } from './useCaptureImage';
import { useToastFeedback } from './useToastFeedback';
import ocrService from '../../../api/services/ocrService';
import audioService from '../../../api/services/audioService';
import type { OCRResponse200 } from '../../../api/types';
import {
  requestAudioPermission,
  configureAudioSession,
  resetAudioSession,
} from '../../../utils/audioUtils';
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
  
  // Estado e ref para gravação de áudio
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // URI do áudio gravado aguardando confirmação do usuário
  const [pendingAudioUri, setPendingAudioUri] = useState<string | null>(null);
  const [audioConfirmModalVisible, setAudioConfirmModalVisible] = useState(false);

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
   * Inicia a gravação de áudio.
   * Solicita permissão, configura sessão e cria o Recording.
   */
  const _startRecording = async (): Promise<void> => {
    try {
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) return;

      await configureAudioSession();

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setProcessingType('audio');
      console.log('🎙️ Gravação iniciada');
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      const msg = error instanceof Error ? error.message : 'Erro ao iniciar gravação';
      showError(msg, 'Erro na Gravação');
    }
  };

  /**
   * Para a gravação e abre o modal de confirmação.
   * O envio só ocorre quando o usuário confirmar em confirmAudioSend().
   */
  const _stopAndSendAudio = async (): Promise<void> => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      await resetAudioSession();

      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) {
        showError('Não foi possível obter o arquivo de áudio.', 'Erro na Gravação');
        return;
      }

      console.log('🎙️ Gravação finalizada. URI:', uri);

      // Abre modal para o usuário ouvir e confirmar antes de enviar
      setPendingAudioUri(uri);
      setAudioConfirmModalVisible(true);

    } catch (error) {
      console.error('Erro ao finalizar gravação:', error);
      const msg = error instanceof Error ? error.message : 'Erro ao processar áudio';
      showError(msg, 'Erro na Gravação');
    }
  };

  /**
   * Confirmação do usuário: envia o áudio pendente para /ai/audio e processa
   * a resposta exatamente como o fluxo de imagem (_processImageWithOCR).
   */
  const confirmAudioSend = async (): Promise<void> => {
    setAudioConfirmModalVisible(false);

    if (!pendingAudioUri) return;

    const uri = pendingAudioUri;
    setPendingAudioUri(null);

    try {
      setIsProcessing(true);
      setStatusMessage('Enviando áudio...');

      const result = await audioService.sendAudioForTranscription(uri);

      if (!result.success || !result.data) {
        const errorMsg = result.error || 'Erro ao processar áudio. Tente novamente.';
        showError(errorMsg, 'Erro no Áudio');
        setProcessingError(errorMsg);
        return;
      }

      // Mesmo mapeamento usado pelo fluxo de imagem
      const mappedResult = mapOCRToAISuggestion(result.data as OCRResponse200);

      setOcrMetadata({
        fkInstituicao: mappedResult.fkInstituicao,
        fkCategoria: mappedResult.fkCategoria,
        idInstituicaoExistente: mappedResult.idInstituicaoExistente,
      });

      setAiSuggestion(mappedResult.aiSuggestion);
      showSuccess('Transação extraída com sucesso!', '✅ Áudio processado');

    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      const msg = error instanceof Error ? error.message : 'Erro ao enviar áudio';
      showError(msg, 'Erro no Áudio');
      setProcessingError(msg);
    } finally {
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  /**
   * Cancelamento do usuário: descarta o áudio sem enviar.
   */
  const cancelAudioSend = (): void => {
    setAudioConfirmModalVisible(false);
    setPendingAudioUri(null);
    setProcessingType(null);
  };

  /**
   * Toggle de gravação de áudio.
   * Primeiro toque: inicia gravação.
   * Segundo toque: para gravação e envia para /ai/audio.
   */
  const handleAudioInput = async (): Promise<void> => {
    if (isRecording) {
      await _stopAndSendAudio();
    } else {
      await _startRecording();
    }
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
    isRecording,
    pendingAudioUri,
    audioConfirmModalVisible,
    handlePhotoCapture,
    handleAudioInput,
    dismissAISuggestion,
    captureFromCamera,
    captureFromGallery,
    retryOCRProcessing,
    confirmAudioSend,
    cancelAudioSend,
  };
};
