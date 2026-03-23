import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api';
import { setAuthToken } from '../api/config';

const TOKEN_KEY = '@contadin:token';
const USER_KEY = '@contadin:user';

interface AuthContextType {
  user: object | null;
  token: string | null;
  loading: boolean;
  login: (credenciais: { email: string; senha: string }) => Promise<void>;
  /** Define token e opcionalmente user (ex.: após login, ao clicar em "Começar a contar"). */
  loginWithToken: (token: string, user?: object | null) => Promise<void>;
  updateUser: (user: object | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credenciais: { email: string; senha: string }) => {
    const response = await authService.login(credenciais);
    // authService retorna response.data; backend envia { data: { token } }
    const newToken = response?.data?.token;
    if (newToken) {
      setTokenState(newToken);
      setAuthToken(newToken);
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      if (response?.data?.user) {
        setUser(response.data.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      } else if (response?.user) {
        setUser(response.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
    }
  }, []);

  const loginWithToken = useCallback(async (newToken: string, userData?: object | null) => {
    setTokenState(newToken);
    setAuthToken(newToken);
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    if (userData != null) {
      setUser(userData);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
  }, []);

  const updateUser = useCallback(async (userData: object | null) => {
    setUser(userData);
    if (userData === null) {
      await AsyncStorage.removeItem(USER_KEY);
      return;
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

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
              setUser(JSON.parse(storedUser));
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
