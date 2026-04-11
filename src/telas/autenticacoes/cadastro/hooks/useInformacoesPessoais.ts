/**
 * Hook para a tela "Adicione suas informações" (Frame 57).
 * Estado: nome, sobrenome, telefone.
 * handleContinuar atualiza os dados do usuário já criado no passo anterior.
 */
import { useState } from "react";
import { usuarioService } from "../../../../api";
import { setAuthToken } from "../../../../api/config";
import { apenasDigitosTelefone } from "../../../../utils/mascaraTelefone";
import {
  extrairUsuarioId,
  MENSAGEM_SESSAO_INVALIDA,
  obterUsuarioIdOuErro,
} from "../../../../utils/normalizacao";
import type { UsuarioAutenticado } from "../../../../api/types";

interface DadosCadastroInicial {
  token?: string;
  user?: UsuarioAutenticado;
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
    const token = cadastroInicial?.token;
    const user = cadastroInicial?.user;
    const userId = obterUsuarioIdOuErro(extrairUsuarioId(user), (message) =>
      setError(message),
    );

    if (!token || !userId) {
      setError(MENSAGEM_SESSAO_INVALIDA);
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
      setAuthToken(token);
      const usuarioAtualizado = await usuarioService.atualizarCadastro(userId, {
        nome: nomeTrim,
        sobrenome: sobrenomeTrim,
        telefone: telefoneDigitos,
      });

      const userAtualizado = {
        id: usuarioAtualizado.id,
        email: usuarioAtualizado.email ?? user?.email ?? "",
        nome: usuarioAtualizado.nome ?? nomeTrim,
        sobrenome: usuarioAtualizado.sobrenome ?? sobrenomeTrim,
      };

      setLoading(false);
      navigation.navigate("SelecaoBancos", { token, user: userAtualizado });
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
