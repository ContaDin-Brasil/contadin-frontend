/**
 * Hook para a tela "Crie sua conta" (Frame 55).
 * Estado: email, senha, confirmarSenha; validação (email, senha mínimo 8 caracteres, senhas iguais).
 * handleCadastrar: usuarioService.criar -> authService.login -> navega para TelaBemVindo com { token, user }.
 * loginWithToken só é chamado ao final do fluxo (TelaCadastroSucesso).
 */
import { useState } from "react";
import { usuarioService, authService } from "../../../../api";
import { setAuthToken } from "../../../../api/config";
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
      const usuarioCriado = await usuarioService.criar({
        email: emailTrim,
        senha: senhaTrim,
        nome: "",
        sobrenome: "",
        tel: "",
      });
      const createdUser =
        usuarioCriado &&
        typeof usuarioCriado === "object" &&
        "id" in usuarioCriado
          ? (usuarioCriado as {
              id: number;
              email?: string;
              nome?: string;
              sobrenome?: string;
              tel?: string;
            })
          : null;

      const loginResponse = await authService.login({
        email: emailTrim,
        senha: senhaTrim,
      });
      const token =
        (
          loginResponse as {
            data?: { data?: { token?: string }; token?: string };
          }
        )?.data?.data?.token ??
        (loginResponse as { data?: { token?: string } })?.data?.token ??
        (loginResponse as { token?: string })?.token;

      if (!token) {
        setError(
          "Conta criada, mas não foi possível entrar. Faça login na tela de login.",
        );
        setLoading(false);
        return false;
      }

      setAuthToken(token);
      const userToStore = createdUser
        ? {
            id: createdUser.id,
            email: createdUser.email ?? emailTrim,
            nome: createdUser.nome ?? "",
            sobrenome: createdUser.sobrenome ?? "",
            tel: createdUser.tel ?? "",
          }
        : {
            id: (usuarioCriado as any)?.id,
            email: emailTrim,
            nome: "",
            sobrenome: "",
            tel: "",
          };
      setLoading(false);
      navigation.replace("BemVindo", { token, user: userToStore });
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Falha ao criar conta. Tente novamente.";
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
