/**
 * Hook para gerenciar alteração de senha
 */
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { AlterarSenha } from '../types/configuracoes.types';
import { validarSenha } from '../constants/constantesConfiguracao';
import { authService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';

interface UsuarioAuth {
  id?: string | number;
}

export const useAlterarSenha = () => {
  const { user } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userAuth = user as UsuarioAuth | null;

  const setSenhaAtualComResetErro = useCallback((valor: string) => {
    setSenhaAtual(valor);
    if (error) setError(null);
  }, [error]);

  const setNovaSenhaComResetErro = useCallback((valor: string) => {
    setNovaSenha(valor);
    if (error) setError(null);
  }, [error]);

  const setConfirmarSenhaComResetErro = useCallback((valor: string) => {
    setConfirmarSenha(valor);
    if (error) setError(null);
  }, [error]);

  const senhaValida = useMemo(() => {
    const erroSenha = validarSenha(novaSenha.trim());
    return !erroSenha && novaSenha.trim() === confirmarSenha.trim();
  }, [confirmarSenha, novaSenha]);

  const handleSavePassword = async () => {
    const senhaAtualTrim = senhaAtual.trim();
    const novaSenhaTrim = novaSenha.trim();
    const confirmarSenhaTrim = confirmarSenha.trim();

    setError(null);

    if (!senhaAtualTrim) {
      setError('Informe a senha atual.');
      return;
    }

    if (!novaSenhaTrim) {
      setError('Informe a nova senha.');
      return;
    }

    const erroSenha = validarSenha(novaSenhaTrim);
    if (erroSenha) {
      setError(erroSenha);
      return;
    }

    if (novaSenhaTrim !== confirmarSenhaTrim) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!userAuth?.id) {
      setError('Não foi possível identificar o usuário logado.');
      return;
    }

    const dados: AlterarSenha = {
      senhaAtual: senhaAtualTrim,
      novaSenha: novaSenhaTrim,
      confirmarSenha: confirmarSenhaTrim,
    };

    try {
      setLoading(true);
      await authService.alterarSenha({
        id: userAuth.id,
        senhaAtual: dados.senhaAtual,
        novaSenha: dados.novaSenha,
        confirmacaoNovaSenha: dados.confirmarSenha,
      });

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      Alert.alert('Senha atualizada', 'Sua senha foi alterada com sucesso.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.mensagem ||
        'Não foi possível alterar a senha. Tente novamente.';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return {
    senhaAtual,
    setSenhaAtual: setSenhaAtualComResetErro,
    novaSenha,
    setNovaSenha: setNovaSenhaComResetErro,
    confirmarSenha,
    setConfirmarSenha: setConfirmarSenhaComResetErro,
    senhaValida,
    loading,
    error,
    handleSavePassword
  };
};
