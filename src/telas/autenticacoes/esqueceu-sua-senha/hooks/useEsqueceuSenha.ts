/**
 * Hook para a tela Solicitar Email (Frame 63).
 * Estado: email, loading, error.
 * handleEnviarCodigo: authService.recuperarSenha({ email }); em 200 retorna success; em erro setError.
 */
import { useState } from "react";
import { authService } from "../../../../api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UseEsqueceuSenhaResult {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleEnviarCodigo: () => Promise<boolean>;
}

export function useEsqueceuSenha(): UseEsqueceuSenhaResult {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnviarCodigo = async (): Promise<boolean> => {
    const emailTrim = email.trim();
    setError(null);

    if (!emailTrim) {
      setError("Informe o email.");
      return false;
    }
    if (!EMAIL_REGEX.test(emailTrim)) {
      setError("Informe um email válido.");
      return false;
    }

    setLoading(true);
    try {
      await authService.recuperarSenha({ email: emailTrim });
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data
          ?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data
          ?.mensagem ||
        (err as { message?: string })?.message ||
        "Falha ao enviar código. Tente novamente.";
      setError(String(msg));
      setLoading(false);
      return false;
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    handleEnviarCodigo,
  };
}
