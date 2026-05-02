import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api';
import { setAuthToken, setOnUnauthorized } from '../api/config';
import type { UsuarioAutenticado } from '../api/types';
import ModalSessaoExpirada from '../componentes/modais/ModalSessaoExpirada';

const TOKEN_KEY = '@contadin:token';
const USER_KEY = '@contadin:user';

interface AuthContextType {
  user: UsuarioAutenticado | null;
  token: string | null;
  loading: boolean;
  login: (credenciais: { email: string; senha: string }) => Promise<void>;
  /** Define token e opcionalmente user (ex.: após login, ao clicar em "Começar a contar"). */
  loginWithToken: (token: string, user?: UsuarioAutenticado | null) => Promise<void>;
  updateUser: (user: UsuarioAutenticado | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessaoExpiradaVisivel, setSessaoExpiradaVisivel] = useState(false);
  const sessaoExpiradaResolveRef = useRef<(() => void) | null>(null);

  const persistUser = useCallback(async (userData: UsuarioAutenticado | null) => {
    setUser(userData);
    if (userData === null) {
      await AsyncStorage.removeItem(USER_KEY);
      return;
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const login = useCallback(async (credenciais: { email: string; senha: string }) => {
    const response = await authService.login(credenciais);
    // authService normaliza o retorno do backend em response.data { token, user }
    const newToken = response.data.token;
    setTokenState(newToken);
    setAuthToken(newToken);
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    await persistUser(response.data.user);
  }, [persistUser]);

  const loginWithToken = useCallback(async (newToken: string, userData?: UsuarioAutenticado | null) => {
    setTokenState(newToken);
    setAuthToken(newToken);
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    if (userData != null) {
      await persistUser(userData);
    }
  }, [persistUser]);

  const updateUser = useCallback(async (userData: UsuarioAutenticado | null) => {
    await persistUser(userData);
  }, [persistUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_e) {
      // ignora erro de rede ao deslogar
    }
    setTokenState(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }, []);

  const handleFecharSessaoExpirada = useCallback(() => {
    setSessaoExpiradaVisivel(false);
    const resolver = sessaoExpiradaResolveRef.current;
    sessaoExpiradaResolveRef.current = null;
    void logout().finally(() => resolver?.());
  }, [logout]);

  useEffect(() => {
    setOnUnauthorized(
      () =>
        new Promise<void>((resolve) => {
          sessaoExpiradaResolveRef.current = resolve;
          setSessaoExpiradaVisivel(true);
        }),
    );
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (cancelled) return;
        if (storedToken) {
          setTokenState(storedToken);
          setAuthToken(storedToken);
          const storedUser = await AsyncStorage.getItem(USER_KEY);
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser) as UsuarioAutenticado;
              setUser(parsedUser);
            } catch (_e) {
              setUser(null);
            }
          }
        } else {
          setTokenState(null);
          setAuthToken(null);
        }
      } catch (_e) {
        if (!cancelled) {
          setTokenState(null);
          setAuthToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithToken,
        updateUser,
        logout,
      }}
    >
      {children}
      <ModalSessaoExpirada
        visible={sessaoExpiradaVisivel}
        onClose={handleFecharSessaoExpirada}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
