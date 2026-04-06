/**
 * Hook para a tela Nova Senha (Frame 65).
 * Estado: senha, confirmarSenha; email e token de route.params.
 * handleAtualizar: validação (senha forte, senhas iguais); authService.redefinirSenha(...).
 * em 200 navega para TelaSenhaAtualizadaSucesso; em 4xx setError("Token inválido ou expirado...").
 */
import { useState } from "react";
import { authService } from "../../../../api";
import { validarSenha } from "../../../configuracoes/constants/constantesConfiguracao";

export interface UseNovaSenhaResult {
  senha: string;
  setSenha: (v: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleAtualizar: (navigation: {
    navigate: (route: string) => void;
  }) => Promise<boolean>;
}

export function useNovaSenha(email: string, token: string): UseNovaSenhaResult {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAtualizar = async (navigation: {
    navigate: (route: string) => void;
  }): Promise<boolean> => {
    const senhaTrim = senha.trim();
    const confirmarTrim = confirmarSenha.trim();
    setError(null);

    if (!senhaTrim) {
      setError("Informe a senha.");
      return false;
    }
    const erroSenha = validarSenha(senhaTrim);
    if (erroSenha) {
      setError(erroSenha);
      return false;
    }
    if (senhaTrim !== confirmarTrim) {
      setError("As senhas não coincidem.");
      return false;
    }

    setLoading(true);
    try {
      await authService.redefinirSenha({
        email,
        pin: token,
        novaSenha: senhaTrim,
        confirmacaoSenha: confirmarTrim,
      });
      setLoading(false);
      navigation.navigate("SenhaAtualizadaSucesso");
      return true;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const msg =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data
          ?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data
          ?.mensagem ||
        (err as { message?: string })?.message;
      setError(
        status && status >= 400 && status < 500
          ? "Token inválido ou expirado. Solicite um novo código."
          : msg
            ? String(msg)
            : "Falha ao atualizar senha. Tente novamente.",
      );
      setLoading(false);
      return false;
    }
  };

  return {
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
    loading,
    error,
    handleAtualizar,
  };
}
