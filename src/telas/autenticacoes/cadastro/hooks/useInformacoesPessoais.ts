/**
 * Hook para a tela "Adicione suas informações" (Frame 57).
 * Estado: nome, sobrenome, telefone.
 * handleContinuar: usuarioService.atualizarParcial(userId, { nome, sobrenome, tel }) -> navega para TelaSelecaoBancos.
 * userId vem do fluxo de cadastro (route.params.user), não do AuthContext.
 */
import { useState } from 'react';
import { usuarioService } from '../../../../api';

export interface UseInformacoesPessoaisResult {
  nome: string;
  setNome: (v: string) => void;
  sobrenome: string;
  setSobrenome: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleContinuar: (navigation: { navigate: (route: string, params?: object) => void }, token: string | undefined, user: object | undefined) => Promise<boolean>;
}

export function useInformacoesPessoais(userId: number | null): UseInformacoesPessoaisResult {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinuar = async (navigation: { navigate: (route: string, params?: object) => void }, token: string | undefined, user: object | undefined): Promise<boolean> => {
    setError(null);
    if (!userId) {
      setError('Sessão inválida. Faça login novamente.');
      return false;
    }

    setLoading(true);
    try {
      await usuarioService.atualizarParcial(userId, {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        tel: telefone.trim(),
      });
      setLoading(false);
      navigation.navigate('SelecaoBancos', { token, user });
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        'Falha ao salvar informações. Tente novamente.';
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
