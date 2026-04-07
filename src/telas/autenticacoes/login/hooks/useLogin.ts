/**
 * Hook para a tela de Login (Fluxo 1)
 * Estado: email, senha, loading, error.
 * handleLogin chama authService.login e retorna sucesso + token para navegar para TelaLoginSucesso.
 */
import { useState } from "react";
import { authService } from "../../../../api";
import type { UsuarioAutenticado } from "../../../../api/types";

export interface UseLoginResult {
  email: string;
  setEmail: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleLogin: () => Promise<
    { success: true; token: string; user: UsuarioAutenticado } | { success: false }
  >;
}

export function useLogin(): UseLoginResult {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (): Promise<
    { success: true; token: string; user: UsuarioAutenticado } | { success: false }
  > => {
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
      const response = await authService.login({
        email: emailTrim,
        senha: senhaTrim,
      });
      const token = response.data.token;
      const user = response.data.user;

      setLoading(false);
      return { success: true, token, user };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Falha ao fazer login. Tente novamente.";
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
