/**
 * Hook para a tela "Crie sua conta" (Frame 55).
 * Estado: email, senha, confirmarSenha; validação (email, senha mínimo 8 caracteres, senhas iguais).
 * handleCadastrar apenas valida dados iniciais e navega para o próximo passo.
 * O cadastro real na API ocorre após preencher nome/sobrenome/telefone.
 */
import { useState } from "react";
import { validarSenha } from "../../../configuracoes/constants/constantesConfiguracao";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UseCriarContaResult {
  email: string;
  setEmail: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (v: string) => void;
  aceiteTermos: boolean;
  setAceiteTermos: (v: boolean) => void;
  loading: boolean;
  error: string | null;
  handleCadastrar: (navigation: {
    replace: (route: string, params?: object) => void;
  }) => Promise<boolean>;
}

export function useCriarConta(): UseCriarContaResult {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCadastrar = async (navigation: {
    replace: (route: string, params?: object) => void;
  }): Promise<boolean> => {
    const emailTrim = email.trim();
    const senhaTrim = senha.trim();
    const confirmarTrim = confirmarSenha.trim();

    setError(null);

    if (!emailTrim) {
      setError("Informe o email.");
      return false;
    }
    if (!EMAIL_REGEX.test(emailTrim)) {
      setError("Informe um email válido.");
      return false;
    }
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
    if (!aceiteTermos) {
      setError("Aceite os termos de serviço para continuar.");
      return false;
    }

    setLoading(true);

    try {
      navigation.replace("BemVindo", {
        cadastro: {
          email: emailTrim,
          senha: senhaTrim,
        },
      });
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Falha ao seguir com o cadastro. Tente novamente.";
      setError(String(msg));
      setLoading(false);
      return false;
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
    aceiteTermos,
    setAceiteTermos,
    loading,
    error,
    handleCadastrar,
  };
}
