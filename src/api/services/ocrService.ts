import { Platform } from 'react-native';
import api, { setAuthToken } from '../config';
import type {
  OCRResponse200,
  OCRResponseError422,
  OCRValidationError,
} from '../types';

/**
 * Dados de imagem capturados pela câmera/galeria
 */
export interface ImageData {
  uri: string;
  base64?: string;
  fileName?: string;
  width?: number;
  height?: number;
}

/**
 * Tipo de método de envio da imagem
 */
export type UploadMethod = 'base64' | 'uri';

/**
 * Callback para rastrear progresso de upload
 */
export type ProgressCallback = (progress: {
  loaded: number; // bytes enviados
  total: number; // bytes totais
  percentage: number; // 0-100
  status: 'uploading' | 'processing' | 'done' | 'error';
  message?: string;
}) => void;

/**
 * Resposta do serviço OCR com timing
 */
export interface OCRServiceResponse {
  success: boolean;
  ocr?: OCRResponse200;
  error?: string;
  method?: UploadMethod;
  uploadTimeMs?: number;
  processingTimeMs?: number;
  totalTimeMs?: number;
}

/**
 * Determina a URL base do endpoint OCR
 * Lê EXPO_PUBLIC_OCR_ENDPOINT ou usa fallback localhost:8000
 */
const getOCRBaseURL = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_OCR_ENDPOINT?.trim();

  if (fromEnv) {
    console.log('🤖 OCR Base URL (env):', fromEnv);
    return fromEnv;
  }

  let baseURL: string;

  if (__DEV__) {
    if (Platform.OS === 'web') {
      baseURL = 'http://localhost:8000';
    } else {
      // Assumindo que o backend OCR Python está no mesmo host que API principal
      baseURL = 'http://192.168.15.35:8000';
    }
  } else {
    baseURL = 'https://ocr.seudominio.com'; // Produção
  }

  console.log('🤖 OCR Base URL:', baseURL);

  return baseURL;
};

/**
 * Determina MIME type baseado no nome do arquivo
 */
const getMimeType = (fileName: string): string => {
  if (fileName.includes('.png')) return 'image/png';
  if (fileName.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
};

const ocrService = {
  /**
   * Escaneia uma imagem e extrai dados de transação
   *
   * @param imageData - Dados da imagem capturada (uri + base64)
   * @param method - Método de envio: 'base64' (padrão) ou 'uri'
   * @param onProgress - Callback para rastrear progresso de upload
   * @param timeoutMs - Timeout em ms (padrão: 30000 = 30s)
   * @returns Promise<OCRServiceResponse>
   *
   * @example
   * const imageData = await captureImage.captureFromCamera(true);
   * const result = await ocrService.scanTransacaoFromImage(
   *   imageData,
   *   'base64',
   *   (progress) => console.log(`Upload: ${progress.percentage}%`)
   * );
   * if (result.success) {
   *   console.log('Transação extraída:', result.ocr?.transacao);
   * } else {
   *   console.error('Erro OCR:', result.error);
   * }
   */
  scanTransacaoFromImage: async (
    imageData: ImageData,
    method: UploadMethod = 'base64',
    onProgress?: ProgressCallback,
    timeoutMs: number = 60000
  ): Promise<OCRServiceResponse> => {
    const startTime = Date.now();
    let uploadStartTime = 0;
    let uploadEndTime = 0;

    try {
      const ocrBaseURL = getOCRBaseURL();
      const fileName = imageData.fileName || 'comprovante.jpg';

      // Log inicial
      console.log(
        `\n🤖 [${new Date().toLocaleTimeString()}] Iniciando OCR Scan`
      );
      console.log(`   Base URL: ${ocrBaseURL}`);
      console.log(`   Arquivo: ${fileName}`);
      console.log(`   Método: ${method}`);

      // Notificar início de upload
      onProgress?.({
        loaded: 0,
        total: 0,
        percentage: 0,
        status: 'uploading',
        message: 'Iniciando upload da imagem...',
      });

      // Monta FormData - envia como multipart para Python
      const formData = new FormData();
      let imageSizeBytes = 0;

      if (!imageData.base64 || !imageData.uri) {
        const errorMsg =
          'Imagem sem base64 ou URI. Captura de imagem pode não ter funcionado corretamente.';
        console.error('❌ ' + errorMsg);
        onProgress?.({
          loaded: 0,
          total: 0,
          percentage: 0,
          status: 'error',
          message: errorMsg,
        });
        return {
          success: false,
          error: errorMsg,
          method,
          totalTimeMs: Date.now() - startTime,
        };
      }

      // Preparar base64
      const base64Data = imageData.base64.includes(',')
        ? imageData.base64.split(',')[1]
        : imageData.base64;
      const mimeType = getMimeType(fileName);
      imageSizeBytes = Math.round((base64Data.length * 3) / 4);

      // Adiciona o arquivo ao FormData com tratamento diferente para web e nativo (mobile)
      if (Platform.OS === 'web') {
        // No web, { uri, type, name } não funciona — precisa de um File/Blob real
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        const blobRes = await fetch(dataUrl);
        const blob = await blobRes.blob();
        formData.append('file', new File([blob], fileName, { type: mimeType }));
        console.log(`   FormData (web): File via base64 → Blob`);
      } else {
        // No nativo (Android/iOS), { uri, type, name } funciona diretamente
        const uploadField = { uri: imageData.uri, type: mimeType, name: fileName };
        console.log(`   FormData (native):`, uploadField);
        formData.append('file', uploadField as any);
      }

      console.log(`   Tamanho (estimado): ~${Math.round(imageSizeBytes / 1024)}KB`);
      console.log(`   MIME Type: ${mimeType}`);
      console.log(`   Campo FormData: 'file'`);

      // Atualizar progresso com tamanho real
      onProgress?.({
        loaded: 0,
        total: imageSizeBytes,
        percentage: 0,
        status: 'uploading',
        message: `Enviando ${Math.round(imageSizeBytes / 1024)}KB...`,
      });

      // Criar controller com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      uploadStartTime = Date.now();
      console.log(
        `   ⏱️  Timeout: ${timeoutMs}ms | Iniciando envio...`
      );

      // Faz requisição POST para OCR endpoint
      const response = await fetch(`${ocrBaseURL}/ai/scan`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          // Não setamos Content-Type: multipart/form-data
          // React Native e browsers fazem isso automaticamente
          ...(typeof localStorage !== 'undefined'
            ? { Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` }
            : {}),
        },
      });

      uploadEndTime = Date.now();
      const uploadTimeMs = uploadEndTime - uploadStartTime;
      clearTimeout(timeoutId);

      console.log(
        `   ✅ Resposta recebida (${uploadTimeMs}ms) | Status: ${response.status}`
      );

      // Tentar parsear como JSON
      let data: any;
      const contentType = response.headers?.get('content-type');
      const isJson = contentType?.includes('application/json');

      try {
        data = isJson ? await response.json() : await response.text();
      } catch (parseError) {
        const errorMsg = `Erro ao parsear resposta: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
        console.error(`   ❌ ${errorMsg}`);
        console.error(`   Resposta raw:`, await response.text());
        onProgress?.({
          loaded: imageSizeBytes,
          total: imageSizeBytes,
          percentage: 100,
          status: 'error',
          message: errorMsg,
        });
        const totalTimeMs = Date.now() - startTime;
        return {
          success: false,
          error: errorMsg,
          method,
          uploadTimeMs,
          totalTimeMs,
        };
      }

      // Notificar processamento
      onProgress?.({
        loaded: imageSizeBytes,
        total: imageSizeBytes,
        percentage: 100,
        status: 'processing',
        message: 'Processando resposta do servidor...',
      });

      if (response.ok && response.status === 200) {
        // Sucesso
        const ocrData = data as OCRResponse200;
        const totalTimeMs = Date.now() - startTime;
        console.log(`   ✨ OCR bem-sucedido!`);
        console.log(`   📦 Transação: ${ocrData.transacao?.descricao}`);
        console.log(`   🏦 Instituição: ${ocrData.instituicao?.nome}`);
        console.log(
          `   ⏱️  Upload: ${uploadTimeMs}ms | Total: ${totalTimeMs}ms`
        );

        onProgress?.({
          loaded: imageSizeBytes,
          total: imageSizeBytes,
          percentage: 100,
          status: 'done',
          message: 'Análise concluída com sucesso!',
        });

        return {
          success: true,
          ocr: ocrData,
          method,
          uploadTimeMs,
          processingTimeMs: totalTimeMs - uploadTimeMs,
          totalTimeMs,
        };
      } else if (response.status === 422) {
        // Erro de validação
        const errorData = data as OCRResponseError422;
        const firstError =
          errorData.detail && errorData.detail.length > 0
            ? errorData.detail[0]
            : null;
        const errorMessage = firstError
          ? firstError.msg
          : 'Erro de validação desconhecido';

        const totalTimeMs = Date.now() - startTime;
        console.warn(`   ⚠️  Erro 422 (${totalTimeMs}ms): ${errorMessage}`);

        onProgress?.({
          loaded: imageSizeBytes,
          total: imageSizeBytes,
          percentage: 100,
          status: 'error',
          message: `Validação falhou: ${errorMessage}`,
        });

        return {
          success: false,
          error: errorMessage,
          method,
          uploadTimeMs,
          totalTimeMs,
        };
      } else {
        // Outros erros HTTP
        let errorMsg = 'Erro desconhecido do servidor OCR';
        
        if (typeof data === 'string') {
          // Resposta em texto (HTML error page, etc)
          errorMsg = `Erro ${response.status}: ${data.substring(0, 200)}`;
        } else if (data.detail) {
          errorMsg = typeof data.detail === 'string' ? data.detail : 'Erro ao processar imagem';
        }

        const totalTimeMs = Date.now() - startTime;
        console.error(
          `   ❌ Erro HTTP ${response.status} (${totalTimeMs}ms):`,
          errorMsg
        );
        console.error(`   Resposta completa:`, data);

        onProgress?.({
          loaded: imageSizeBytes,
          total: imageSizeBytes,
          percentage: 100,
          status: 'error',
          message: `Erro ${response.status}: ${errorMsg}`,
        });

        return {
          success: false,
          error: errorMsg,
          method,
          uploadTimeMs,
          totalTimeMs,
        };
      }
    } catch (error) {
      const totalTimeMs = Date.now() - startTime;

      if (error instanceof Error && error.name === 'AbortError') {
        // Timeout
        const errorMsg = `Timeout: Requisição excedeu ${timeoutMs}ms sem resposta`;
        console.error(`   ❌ ${errorMsg}`);
        onProgress?.({
          loaded: 0,
          total: 0,
          percentage: 0,
          status: 'error',
          message: errorMsg,
        });
        return {
          success: false,
          error: errorMsg,
          method,
          totalTimeMs,
        };
      }

      // Erro de conexão geral
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao processar imagem';

      console.error(
        `   ❌ Erro de conexão (${totalTimeMs}ms):`,
        errorMessage
      );
      console.error(error);

      onProgress?.({
        loaded: 0,
        total: 0,
        percentage: 0,
        status: 'error',
        message: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
        method,
        totalTimeMs,
      };
    }
  },
};

export default ocrService;
