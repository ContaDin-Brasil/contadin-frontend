/**
 * Hook para a tela "Quais bancos você utiliza" (Frames 58/59).
 * Lista instituições padrão (BANCOS_PADRAO), estado selecionados (ids).
 * Ao Continuar: instituicaoService.criar para cada selecionado com fkUsuario; navega para TelaCadastroSucesso com token e user.
 */
import { useState } from "react";
import { instituicaoService } from "../../../../api";
import { BANCOS_PADRAO } from "../../../carteira/constants/instituicoesPadrao";
import { obterUsuarioIdOuErro } from "../../../../utils/normalizacao";

export interface InstituicaoPadrao {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  type: 'BANCO' | 'VALE';
}

const bancosPadraoNormalizados: InstituicaoPadrao[] = BANCOS_PADRAO.map((banco) => ({
  ...banco,
  type: banco.type === 'VALE' ? 'VALE' : 'BANCO',
}));

export interface UseSelecaoBancosResult {
  bancos: InstituicaoPadrao[];
  selecionados: Set<string>;
  toggleSelecao: (id: string) => void;
  loading: boolean;
  error: string | null;
  handleContinuar: (
    navigation: { navigate: (route: string, params?: object) => void },
    token: string | undefined,
    user: object | undefined,
  ) => Promise<boolean>;
}

export function useSelecaoBancos(
  userId: number | string | null,
): UseSelecaoBancosResult {
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelecao = (id: string) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinuar = async (
    navigation: { navigate: (route: string, params?: object) => void },
    token: string | undefined,
    user: object | undefined,
  ): Promise<boolean> => {
    setError(null);
    const userIdNormalizado = obterUsuarioIdOuErro(userId, (message) => setError(message));

    if (!userIdNormalizado) {
      return false;
    }

    const lista = Array.from(selecionados);
    if (lista.length === 0) {
      navigation.navigate("CadastroSucesso", { token, user });
      return true;
    }

    setLoading(true);
    try {
      for (const id of lista) {
        const banco = bancosPadraoNormalizados.find((b) => b.id === id);
        if (banco) {
          await instituicaoService.criar({
            nome: banco.nome,
            icone: banco.icone,
            cor: banco.cor,
            type: "BANCO",
            fkUsuario: userIdNormalizado,
            ativo: true,
          });
        }
      }
      setLoading(false);
      navigation.navigate("CadastroSucesso", { token, user });
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Falha ao salvar bancos. Tente novamente.";
      setError(String(msg));
      setLoading(false);
      return false;
    }
  };

  return {
    bancos: bancosPadraoNormalizados,
    selecionados,
    toggleSelecao,
    loading,
    error,
    handleContinuar,
  };
}
