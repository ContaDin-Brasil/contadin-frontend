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
 * Lê EXPO_PUBLIC_API_BASE_URL do .env (Ex.: http://192.168.X.X:8080).
 * Em desenvolvimento no browser, aceita http://localhost:8080 como fallback.
 * Em dispositivo físico ou emulador, a variável de ambiente é obrigatória.
 *
 * Para produção: defina EXPO_PUBLIC_API_BASE_URL com a URL do servidor.
 */
const getBaseURL = (): string => {
  const fromEnv = normalizeEnvUrl(process.env.EXPO_PUBLIC_API_BASE_URL);

  if (fromEnv) {
    console.log("🌐 API Base URL (env):", fromEnv);
    console.log("📱 Plataforma:", Platform.OS);
    return fromEnv;
  }

  if (__DEV__) {
    if (Platform.OS === "web") {
      const fallback = "http://localhost:8080";
      console.warn(
        "⚠️ EXPO_PUBLIC_API_BASE_URL não definida. Usando fallback para browser:",
        fallback,
      );
      return fallback;
    }

    // Em dispositivo físico ou emulador, localhost não funciona —
    // o celular não consegue alcançar a máquina de desenvolvimento por esse endereço.
    // Configure o IP da sua máquina no .env (use ipconfig para descobrir).
    console.error(
      "❌ EXPO_PUBLIC_API_BASE_URL não definida. " +
        "Em dispositivo físico/emulador é necessário definir o IP da máquina no .env. " +
        "Execute ipconfig e adicione: EXPO_PUBLIC_API_BASE_URL=http://<SEU_IP>:8080",
    );
  }

  return "https://api.seudominio.com";
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

type OnUnauthorizedHandler = () => void | Promise<void>;
let onUnauthorized: OnUnauthorizedHandler | null = null;
let isHandlingUnauthorized = false;

const AUTH_PUBLIC_ROUTES = [
  "/auth/cadastro",
  "/auth/login",
  "/auth/esqueceu-senha",
  "/auth/validar-pin",
  "/auth/redefinir-senha",
  "/auth/reenviar-pin",
];

const isPublicAuthRoute = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_PUBLIC_ROUTES.some((route) => url.includes(route));
};

export const setAuthToken = (token: string | null): void => {
  authTokenInMemory = token;
};

export const setOnUnauthorized = (handler: OnUnauthorizedHandler | null): void => {
  onUnauthorized = handler;
};

const triggerUnauthorized = (): void => {
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  const handler = onUnauthorized;
  if (!handler) {
    isHandlingUnauthorized = false;
    return;
  }

  Promise.resolve(handler()).finally(() => {
    isHandlingUnauthorized = false;
  });
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`➡️  ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

    if (isPublicAuthRoute(config.url)) {
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
      return config;
    }

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
    const requestUrl = error.config?.url ?? "";
    const isLogoutRequest = requestUrl.includes("/auth/logout");
    const isPublicRoute = isPublicAuthRoute(requestUrl);
    const status = error.response?.status;

    // Tratamento de erros globais
    if (error.response) {
      // Erro da API (status code fora de 2xx)
      console.error("❌ Erro da API:", error.response.data);
      console.error("❌ Status:", error.response.status);

      if (status === 401 && !isLogoutRequest && !isPublicRoute) {
        triggerUnauthorized();
      }
    } else if (error.request) {
      if (isLogoutRequest) {
        return Promise.reject(error);
      }

      // Erro de rede (sem resposta)
      console.error("❌ Erro de rede - Sem resposta do servidor");
      const baseUrl = error.config?.baseURL ?? "";
      const url = error.config?.url ?? "";
      console.error("❌ URL tentada:", `${baseUrl}${url}`);
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
