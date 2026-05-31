import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@contadin:theme';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  currentTheme: 'light' | 'dark'; // Tema efetivo (resolvido de 'system' se necessário)
  themePreference: Theme; // Preferência do usuário (light | dark | system)
  setTheme: (theme: Theme) => Promise<void>;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<Theme>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Resolver o tema efetivo baseado na preferência e preferência do sistema
  const resolveCurrentTheme = useCallback(
    (preference: Theme): 'light' | 'dark' => {
      if (preference === 'system') {
        return systemColorScheme === 'dark' ? 'dark' : 'light';
      }
      return preference;
    },
    [systemColorScheme],
  );

  // Carregar preferência de tema armazenada
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
          setThemePreference(saved);
        }
      } catch (error) {
        console.error('Erro ao carregar preferência de tema:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      try {
        setThemePreference(newTheme);
        await AsyncStorage.setItem(THEME_KEY, newTheme);
      } catch (error) {
        console.error('Erro ao salvar preferência de tema:', error);
      }
    },
    [],
  );

  const currentTheme = resolveCurrentTheme(themePreference);
  const isDarkMode = currentTheme === 'dark';

  if (isLoading) {
    return null; // Ou um splash screen
  }

  const value: ThemeContextType = {
    currentTheme,
    themePreference,
    setTheme,
    isDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
