import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";

const normalizeEnvUrl = (value?: string): string | null => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Aceita valor com ou sem aspas no .env
  const unquoted = trimmed.replace(/^['\"]|['\"]$/g, "").trim();
  return unquoted || null;
};

/**
 * Configuração da URL base da API
 *
 * Lê EXPO_PUBLIC_API_BASE_URL do .env (Ex.: http://192.168.15.13:8080).
 * Se não estiver definida, usa fallback por plataforma em __DEV__.
 *
 * Para produção: defina EXPO_PUBLIC_API_BASE_URL ou a URL será https://api.seudominio.com
 */
const getBaseURL = (): string => {
  const fromEnv = normalizeEnvUrl(process.env.EXPO_PUBLIC_API_BASE_URL);

  if (fromEnv) {
    console.log("🌐 API Base URL (env):", fromEnv);
    console.log("📱 Plataforma:", Platform.OS);
    return fromEnv;
  }

  let baseURL: string;

  if (__DEV__) {
    if (Platform.OS === "web") {
      baseURL = "http://localhost:8080";
    } else if (Platform.OS === "android") {
      baseURL = "http://192.168.18.233:8080";
    } else {
      baseURL = "http://localhost:8080";
    }
  } else {
    baseURL = "https://api.seudominio.com";
  }

  console.log("🌐 API Base URL:", baseURL);
  console.log("📱 Plataforma:", Platform.OS);

  return baseURL;
};

// Instância do axios configurada
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token em memória (atualizado no login/logout e na inicialização do AuthContext)
// O interceptor do axios é síncrono, então não podemos ler AsyncStorage aqui.
let authTokenInMemory: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authTokenInMemory = token;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`➡️  ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    if (authTokenInMemory) {
      config.headers.Authorization = `Bearer ${authTokenInMemory}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    // Tratamento de erros globais
    if (error.response) {
      // Erro da API (status code fora de 2xx)
      console.error("❌ Erro da API:", error.response.data);
      console.error("❌ Status:", error.response.status);
    } else if (error.request) {
      // Erro de rede (sem resposta)
      console.error("❌ Erro de rede - Sem resposta do servidor");
      console.error("❌ URL tentada:", error.config?.baseURL + error.config?.url);
      console.error("❌ Método:", error.config?.method);
      console.error("❌ Mensagem:", error.message);
    } else {
      // Erro ao configurar a requisição
      console.error("Erro:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
