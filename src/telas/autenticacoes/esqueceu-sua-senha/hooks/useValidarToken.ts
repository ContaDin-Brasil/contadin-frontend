/**
 * Hook para a tela Validar Token/PIN (Frames 64/66).
 * Estado: token (6 caracteres), email, loading, error.
 * Countdown para "Enviar código novamente". handleReenviar: recuperarSenha + reinicia countdown.
 * handleValidar: navega para TelaNovaSenha com email e token (validação real do token ao submeter nova senha).
 */
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../../../../api';

const COUNTDOWN_SEGUNDOS = 10;

export interface UseValidarTokenResult {
  token: string;
  setToken: (v: string) => void;
  setPinDigit: (index: number, value: string) => void;
  pinDigits: string[];
  loading: boolean;
  error: string | null;
  countdown: number;
  podeReenviar: boolean;
  handleReenviar: () => Promise<void>;
  handleValidar: () => boolean;
}

export function useValidarToken(email: string): UseValidarTokenResult {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SEGUNDOS);

  const token = pinDigits.join('');

  const setPinDigit = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      const chars = value.replace(/\D/g, '').slice(0, 6).split('');
      setPinDigits(prev => {
        const next = [...prev];
        chars.forEach((c, i) => {
          if (index + i < 6) next[index + i] = c;
        });
        return next;
      });
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    setPinDigits(prev => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  }, []);

  const setToken = useCallback((v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 6).split('');
    setPinDigits(prev => {
      const next = [...prev];
      digits.forEach((d, i) => { next[i] = d; });
      for (let i = digits.length; i < 6; i++) next[i] = '';
      return next;
    });
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleReenviar = async () => {
    if (countdown > 0 || !email) return;
    setError(null);
    setLoading(true);
    try {
      await authService.recuperarSenha({ email });
      setCountdown(COUNTDOWN_SEGUNDOS);
    } catch {
      setError('Falha ao reenviar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = (): boolean => {
    setError(null);
    if (token.length !== 6) {
      setError('PIN incorreto, tente novamente.');
      return false;
    }
    return true;
  };

  return {
    token,
    setToken,
    setPinDigit,
    pinDigits,
    loading,
    error,
    countdown,
    podeReenviar: countdown <= 0,
    handleReenviar,
    handleValidar,
  };
}
