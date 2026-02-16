import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Configuração da URL base da API
 * 
 * Para desenvolvimento local com mock server:
 * - iOS Simulator: http://localhost:3001
 * - Android Emulator: http://10.0.2.2:3001
 * - Dispositivo físico: http://SEU_IP_LOCAL:3001
 * 
 * Para produção: substitua pela URL real da API
 */
const getBaseURL = () => {
  let baseURL;
  
  if (__DEV__) {
    // Ambiente de desenvolvimento (mock server)
    // IMPORTANTE: Use o IP real da sua máquina ao invés de 10.0.2.2
    // pois o Windows Firewall pode bloquear 10.0.2.2
    if (Platform.OS === 'android') {
      baseURL = 'http://192.168.15.35:3001'; // IP real da máquina Windows
    } else {
      baseURL = 'http://localhost:3001';
    }
  } else {
    // Ambiente de produção
    baseURL = 'https://api.seudominio.com';
  }
  
  console.log('🌐 API Base URL:', baseURL);
  console.log('📱 Plataforma:', Platform.OS);
  
  return baseURL;
};

// Instância do axios configurada
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (quando implementado)
api.interceptors.request.use(
  (config) => {
    console.log(`➡️  ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Aqui você pode adicionar o token de autenticação
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros globais
    if (error.response) {
      // Erro da API (status code fora de 2xx)
      console.error('❌ Erro da API:', error.response.data);
      console.error('❌ Status:', error.response.status);
    } else if (error.request) {
      // Erro de rede (sem resposta)
      console.error('❌ Erro de rede - Sem resposta do servidor');
      console.error('❌ URL tentada:', error.config?.baseURL + error.config?.url);
      console.error('❌ Método:', error.config?.method);
      console.error('❌ Mensagem:', error.message);
    } else {
      // Erro ao configurar a requisição
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
