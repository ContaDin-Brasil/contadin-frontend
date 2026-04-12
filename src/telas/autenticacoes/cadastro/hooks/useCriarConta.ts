/**
 * Hook para a tela "Crie sua conta" (Frame 55).
 * Estado: email, senha, confirmarSenha; validação (email, senha mínimo 8 caracteres, senhas iguais).
 * handleCadastrar valida dados iniciais, cria o usuário e autentica.
 * O preenchimento de nome/sobrenome/telefone ocorre no próximo passo via PATCH.
 */
import { useState } from "react";
import { validarSenha } from "../../../configuracoes/constants/constantesConfiguracao";
import { authService } from "../../../../api";

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
      const usuarioCriado = await authService.cadastrar({
        nome: null,
        sobrenome: null,
        email: emailTrim,
        telefone: null,
        senha: senhaTrim,
        ativo: true,
      });

      const loginResponse = await authService.login({
        email: emailTrim,
        senha: senhaTrim,
      });

      const token = loginResponse.data.token;
      const user = {
        id: usuarioCriado.id ?? loginResponse.data.user.id,
        email: loginResponse.data.user.email,
        nome: loginResponse.data.user.nome,
        sobrenome: loginResponse.data.user.sobrenome,
      };

      navigation.replace("BemVindo", {
        cadastro: {
          token,
          user,
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
