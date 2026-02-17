import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

interface CacheContextType {
  getCache: <T>(key: string) => Promise<T | null>;
  setCache: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  invalidateCache: (key: string) => Promise<void>;
  invalidateCacheByPattern: (pattern: string) => Promise<void>;
  clearAllCache: () => Promise<void>;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

// Cache em memória (mais rápido que AsyncStorage)
const memoryCache: Map<string, CacheEntry<any>> = new Map();

// TTL padrão: 5 minutos
const DEFAULT_TTL = 5 * 60 * 1000;

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /**
   * Verifica se o cache ainda é válido baseado no timestamp e TTL
   */
  const isCacheValid = (entry: CacheEntry<any>): boolean => {
    const now = Date.now();
    return now - entry.timestamp < entry.ttl;
  };

  /**
   * Busca dados do cache (primeiro memória, depois AsyncStorage)
   */
  const getCache = useCallback(async <T,>(key: string): Promise<T | null> => {
    try {
      // 1. Verifica cache em memória primeiro (mais rápido)
      const memEntry = memoryCache.get(key);
      if (memEntry && isCacheValid(memEntry)) {
        console.log('[Cache] HIT (memory):', key);
        return memEntry.data as T;
      }

      // 2. Se não está em memória, verifica AsyncStorage
      const storedData = await AsyncStorage.getItem(`@cache:${key}`);
      if (storedData) {
        const entry: CacheEntry<T> = JSON.parse(storedData);
        
        if (isCacheValid(entry)) {
          console.log('[Cache] HIT (storage):', key);
          // Restaura para memória para próximo acesso
          memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Cache expirado, remove
          console.log('[Cache] EXPIRED:', key);
          await AsyncStorage.removeItem(`@cache:${key}`);
        }
      }

      console.log('[Cache] MISS:', key);
      return null;
    } catch (error) {
      console.error('[Cache] Erro ao buscar cache:', error);
      return null;
    }
  }, []);

  /**
   * Salva dados no cache (memória + AsyncStorage)
   */
  const setCache = useCallback(async <T,>(
    key: string, 
    data: T, 
    ttl: number = DEFAULT_TTL
  ): Promise<void> => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      // Salva em memória
      memoryCache.set(key, entry);

      // Salva em AsyncStorage para persistência
      await AsyncStorage.setItem(`@cache:${key}`, JSON.stringify(entry));
      
      console.log('[Cache] SET:', key, `(TTL: ${ttl / 1000}s)`);
    } catch (error) {
      console.error('[Cache] Erro ao salvar cache:', error);
    }
  }, []);

  /**
   * Invalida (remove) um cache específico
   */
  const invalidateCache = useCallback(async (key: string): Promise<void> => {
    try {
      memoryCache.delete(key);
      await AsyncStorage.removeItem(`@cache:${key}`);
      console.log('[Cache] INVALIDATED:', key);
    } catch (error) {
      console.error('[Cache] Erro ao invalidar cache:', error);
    }
  }, []);

  /**
   * Invalida todos os caches que contêm determinado padrão
   * Ex: invalidateCacheByPattern('instituicao') invalida todos os caches de instituições
   */
  const invalidateCacheByPattern = useCallback(async (pattern: string): Promise<void> => {
    try {
      // Limpa memória
      const keysToDelete: string[] = [];
      memoryCache.forEach((_, key) => {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => memoryCache.delete(key));

      // Limpa AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter(key => 
        key.startsWith('@cache:') && key.includes(pattern)
      );
      await AsyncStorage.multiRemove(keysToRemove);

      console.log('[Cache] INVALIDATED BY PATTERN:', pattern, `(${keysToRemove.length} items)`);
    } catch (error) {
      console.error('[Cache] Erro ao invalidar cache por padrão:', error);
    }
  }, []);

  /**
   * Limpa todo o cache
   */
  const clearAllCache = useCallback(async (): Promise<void> => {
    try {
      memoryCache.clear();
      
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('@cache:'));
      await AsyncStorage.multiRemove(cacheKeys);

      console.log('[Cache] ALL CLEARED:', `(${cacheKeys.length} items)`);
    } catch (error) {
      console.error('[Cache] Erro ao limpar todo cache:', error);
    }
  }, []);

  return (
    <CacheContext.Provider
      value={{
        getCache,
        setCache,
        invalidateCache,
        invalidateCacheByPattern,
        clearAllCache,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

/**
 * Hook para usar o cache em qualquer componente/hook
 */
export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache deve ser usado dentro de um CacheProvider');
  }
  return context;
};
