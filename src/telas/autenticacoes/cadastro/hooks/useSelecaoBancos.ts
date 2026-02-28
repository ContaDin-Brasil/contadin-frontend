/**
 * Hook para a tela "Quais bancos você utiliza" (Frames 58/59).
 * Lista instituições padrão (BANCOS_PADRAO), estado selecionados (ids).
 * Ao Continuar: instituicaoService.criar para cada selecionado com fk_usuario; navega para TelaCadastroSucesso com token e user.
 */
import { useState } from 'react';
import { instituicaoService } from '../../../../api';
import { BANCOS_PADRAO } from '../../../carteira/constants/instituicoesPadrao';

export interface InstituicaoPadrao {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  tipoInstituicao: string;
}

export interface UseSelecaoBancosResult {
  bancos: InstituicaoPadrao[];
  selecionados: Set<string>;
  toggleSelecao: (id: string) => void;
  loading: boolean;
  error: string | null;
  handleContinuar: (navigation: { navigate: (route: string, params?: object) => void }, token: string | undefined, user: object | undefined) => Promise<boolean>;
}

export function useSelecaoBancos(userId: number | null): UseSelecaoBancosResult {
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

  const handleContinuar = async (navigation: { navigate: (route: string, params?: object) => void }, token: string | undefined, user: object | undefined): Promise<boolean> => {
    setError(null);
    if (!userId) {
      setError('Sessão inválida. Faça login novamente.');
      return false;
    }

    const lista = Array.from(selecionados);
    if (lista.length === 0) {
      navigation.navigate('CadastroSucesso', { token, user });
      return true;
    }

    setLoading(true);
    try {
      for (const id of lista) {
        const banco = BANCOS_PADRAO.find((b) => b.id === id);
        if (banco) {
          await instituicaoService.criar({
            nome: banco.nome,
            icone: banco.icone,
            cor: banco.cor,
            tipoInstituicao: 'banco',
            fk_usuario: userId,
          });
        }
      }
      setLoading(false);
      navigation.navigate('CadastroSucesso', { token, user });
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        'Falha ao salvar bancos. Tente novamente.';
      setError(String(msg));
      setLoading(false);
      return false;
    }
  };

  return {
    bancos: BANCOS_PADRAO,
    selecionados,
    toggleSelecao,
    loading,
    error,
    handleContinuar,
  };
}
