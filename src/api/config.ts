import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";

/**
 * Configuração da URL base da API
 *
 * Lê EXPO_PUBLIC_API_BASE_URL do .env (Ex.: http://192.168.15.13:3001).
 * Se não estiver definida, usa fallback por plataforma em __DEV__.
 *
 * Para produção: defina EXPO_PUBLIC_API_BASE_URL ou a URL será https://api.seudominio.com
 */
const getBaseURL = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (fromEnv) {
    console.log("🌐 API Base URL (env):", fromEnv);
    console.log("📱 Plataforma:", Platform.OS);
    return fromEnv;
  }

  let baseURL: string;

  if (__DEV__) {
    if (Platform.OS === "android") {
      baseURL = "http://10.0.2.2:3001";
    } else {
      baseURL = "http://localhost:3001";
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
