/**
 * Hook para a tela "Adicione suas informações" (Frame 57).
 * Estado: nome, sobrenome, telefone.
 * handleContinuar cria a conta no backend com todos os dados e já faz login.
 */
import { useState } from "react";
import { authService } from "../../../../api";
import { setAuthToken } from "../../../../api/config";
import { apenasDigitosTelefone } from "../../../../utils/mascaraTelefone";

interface DadosCadastroInicial {
  email?: string;
  senha?: string;
}

export interface UseInformacoesPessoaisResult {
  nome: string;
  setNome: (v: string) => void;
  sobrenome: string;
  setSobrenome: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleContinuar: (navigation: {
    navigate: (route: string, params?: object) => void;
  }) => Promise<boolean>;
}

export function useInformacoesPessoais(
  cadastroInicial: DadosCadastroInicial | undefined,
): UseInformacoesPessoaisResult {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinuar = async (navigation: {
    navigate: (route: string, params?: object) => void;
  }): Promise<boolean> => {
    setError(null);
    const email = cadastroInicial?.email?.trim();
    const senha = cadastroInicial?.senha?.trim();

    if (!email || !senha) {
      setError("Sessão inválida. Faça login novamente.");
      return false;
    }

    const nomeTrim = nome.trim();
    const sobrenomeTrim = sobrenome.trim();
    const telefoneDigitos = apenasDigitosTelefone(telefone);

    if (!nomeTrim) {
      setError("Informe o nome.");
      return false;
    }

    if (!sobrenomeTrim) {
      setError("Informe o sobrenome.");
      return false;
    }

    if (!telefoneDigitos) {
      setError("Informe o telefone.");
      return false;
    }

    setLoading(true);
    try {
      const usuarioCriado = await authService.cadastrar({
        nome: nomeTrim,
        sobrenome: sobrenomeTrim,
        email,
        telefone: telefoneDigitos,
        senha,
        ativo: true,
      });

      const loginResponse = await authService.login({ email, senha });
      const token = loginResponse.data.token;

      const userId =
        usuarioCriado.id ??
        loginResponse.data.user.id;

      setAuthToken(token);

      const user = {
        id: userId,
        email: usuarioCriado.email ?? email,
        nome: usuarioCriado.nome ?? nomeTrim,
        sobrenome: usuarioCriado.sobrenome ?? sobrenomeTrim,
        telefone: usuarioCriado.telefone ?? telefoneDigitos,
      };

      setLoading(false);
      navigation.navigate("SelecaoBancos", { token, user });
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.mensagem ||
        (err as { message?: string })?.message ||
        "Falha ao concluir cadastro. Tente novamente.";
      setError(String(msg));
      setLoading(false);
      return false;
    }
  };

  return {
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    telefone,
    setTelefone,
    loading,
    error,
    handleContinuar,
  };
}
