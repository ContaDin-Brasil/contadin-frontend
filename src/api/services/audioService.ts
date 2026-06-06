import { Platform } from 'react-native';
import type { AIProcessingError, AIProcessingErrorKind, OCRResponse200 } from '../types';

/**
 * Resposta do serviço de áudio.
 * O campo `data` é tipado como OCRResponse200 — mesmo formato retornado por /ai/scan.
 */
export interface AudioServiceResponse {
  success: boolean;
  data?: OCRResponse200;
  error?: AIProcessingError;
  totalTimeMs?: number;
}

const mapStatusToErrorKind = (status?: number): AIProcessingErrorKind => {
  if (status === 400) return 'bad_request';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 422) return 'validation';
  if (status && status >= 500) return 'server_error';
  return 'unknown';
};

const buildError = (
  kind: AIProcessingErrorKind,
  message: string,
  statusCode?: number,
  details?: string,
  retryable = true,
): AIProcessingError => ({
  kind,
  message,
  statusCode,
  details,
  retryable,
});

const extractReadableError = (payload: unknown, fallbackMessage: string): string => {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return fallbackMessage;

    try {
      return extractReadableError(JSON.parse(trimmed), fallbackMessage);
    } catch (_e) {
      return trimmed;
    }
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as Record<string, unknown>;

    if (typeof candidate.message === 'string' && candidate.message.trim()) {
      return candidate.message.trim();
    }

    if (typeof candidate.detail === 'string' && candidate.detail.trim()) {
      return candidate.detail.trim();
    }

    if (Array.isArray(candidate.detail) && candidate.detail.length > 0) {
      const firstDetail = candidate.detail[0] as Record<string, unknown> | undefined;
      if (firstDetail && typeof firstDetail.msg === 'string' && firstDetail.msg.trim()) {
        return firstDetail.msg.trim();
      }
    }

    if (typeof candidate.error === 'string' && candidate.error.trim()) {
      return candidate.error.trim();
    }
  }

  return fallbackMessage;
};

/**
 * Determina a URL base do serviço de áudio/ETL.
 * Lê EXPO_PUBLIC_OCR_ENDPOINT do .env (Ex.: http://192.168.X.X:8000).
 * Em desenvolvimento no browser, aceita http://localhost:8000 como fallback.
 * Em dispositivo físico ou emulador, a variável de ambiente é obrigatória.
 */
const getETLBaseURL = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_PYTHON_BASE_URL?.trim();

  if (fromEnv) {
    return fromEnv;
  }

  if (__DEV__) {
    if (Platform.OS === 'web') {
      console.warn('⚠️ EXPO_PUBLIC_OCR_ENDPOINT não definida. Usando fallback para browser: http://localhost:8000');
      return 'http://localhost:8000';
    }

    console.error(
      '❌ EXPO_PUBLIC_OCR_ENDPOINT não definida. ' +
        'Em dispositivo físico/emulador configure o IP da máquina no .env. ' +
        'Execute ipconfig e adicione: EXPO_PUBLIC_OCR_ENDPOINT=http://<SEU_IP>:8000',
    );
  }

  return 'https://ocr.seudominio.com';
};

const audioService = {
  /**
   * Envia o áudio gravado para o endpoint de transcrição do ETL.
   *
   * Segue o mesmo padrão de ocrService.scanTransacaoFromImage:
   * - FormData com campo 'file'
   * - fetch POST (sem Content-Type manual — multipart é setado automaticamente)
   * - AbortController para timeout
   *
   * Tratamento da resposta (setAiSuggestion etc.) será feito na etapa 2.
   *
   * @param audioUri - URI local do arquivo gravado (expo-av retorna m4a)
   * @param timeoutMs - Timeout em ms (padrão: 60000)
   */
  sendAudioForTranscription: async (
    audioUri: string,
    timeoutMs: number = 60000
  ): Promise<AudioServiceResponse> => {
    const startTime = Date.now();

    try {
      const baseURL = getETLBaseURL();
      console.log(`\n🎙️ [${new Date().toLocaleTimeString()}] Iniciando envio de áudio`);
      console.log(`   Base URL: ${baseURL}`);
      console.log(`   URI: ${audioUri}`);

      const formData = new FormData();

      if (Platform.OS === 'web') {
        // No web, a URI é uma blob URL — precisa buscar o blob real antes de anexar
        const blobResponse = await fetch(audioUri);
        const blob = await blobResponse.blob();
        formData.append('file', new File([blob], 'gravacao.m4a', { type: 'audio/m4a' }));
      } else {
        // No nativo (Android/iOS), a abordagem { uri, type, name } funciona direto
        formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'gravacao.m4a' } as any);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${baseURL}/ai/audio`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const totalTimeMs = Date.now() - startTime;

      console.log(`   ✅ Resposta recebida (${totalTimeMs}ms) | Status: ${response.status}`);

      if (response.ok) {
        const contentType = response.headers?.get('content-type');
        const data: OCRResponse200 = contentType?.includes('application/json')
          ? await response.json()
          : await response.text();

        console.log(`   ✨ Áudio enviado com sucesso`);
        return { success: true, data, totalTimeMs };
      }

      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (_e) {
        errorBody = '';
      }

      const readableMessage = extractReadableError(errorBody, 'Não foi possível extrair informações financeiras do áudio. Tente novamente.');
      const errorMsg = readableMessage.startsWith('Erro ')
        ? readableMessage
        : readableMessage;
      console.error(`   ❌ ${errorMsg}`);
      return {
        success: false,
        error: buildError(
          mapStatusToErrorKind(response.status),
          errorMsg,
          response.status,
          readableMessage,
          response.status < 500,
        ),
        totalTimeMs,
      };

    } catch (error) {
      const totalTimeMs = Date.now() - startTime;

      if (error instanceof Error && error.name === 'AbortError') {
        const msg = `Timeout: requisição excedeu ${timeoutMs}ms`;
        console.error(`   ❌ ${msg}`);
        return { success: false, error: buildError('timeout', msg, undefined, msg, true), totalTimeMs };
      }

      const msg = error instanceof Error ? error.message : 'Erro desconhecido ao enviar áudio';
      console.error(`   ❌ Erro de conexão (${totalTimeMs}ms):`, msg);
      return { success: false, error: buildError('network_error', msg, undefined, msg, true), totalTimeMs };
    }
  },
};

export default audioService;
