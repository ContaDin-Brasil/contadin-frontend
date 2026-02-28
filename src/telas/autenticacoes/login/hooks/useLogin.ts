/**
 * Hook para a tela de Login (Fluxo 1)
 * Estado: email, senha, loading, error.
 * handleLogin chama authService.login e retorna sucesso + token para navegar para TelaLoginSucesso.
 */
import { useState } from "react";
import { authService } from "../../../../api";

export interface UseLoginResult {
  email: string;
  setEmail: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleLogin: () => Promise<{ success: true; token: string; user?: object } | { success: false }>;
}

export function useLogin(): UseLoginResult {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (): Promise<{ success: true; token: string; user?: object } | { success: false }> => {
    const emailTrim = email.trim();
    const senhaTrim = senha.trim();
    if (!emailTrim) {
      setError("Informe o email.");
      return { success: false };
    }
    if (!senhaTrim) {
      setError("Informe a senha.");
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email: emailTrim, senha: senhaTrim });
      // Backend pode enviar response.data.data.token ou response.data.token
      const token = (response as { data?: { data?: { token?: string }; token?: string } })?.data?.data?.token ?? (response as { data?: { token?: string } })?.data?.token ?? (response as { token?: string })?.token;
      const user = (response as { data?: { data?: { user?: object }; user?: object } })?.data?.data?.user ?? (response as { data?: { user?: object } })?.data?.user ?? (response as { user?: object })?.user;

      if (!token) {
        setError("Resposta inválida do servidor.");
        return { success: false };
      }
      setLoading(false);
      return { success: true, token, user };
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as { message?: string })?.message || "Falha ao fazer login. Tente novamente.";
      setError(String(message));
      setLoading(false);
      return { success: false };
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    error,
    handleLogin,
  };
}
