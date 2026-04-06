import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import recorrenciaService from '../../../api/services/recorrenciaService';
import { useAuth } from '../../../contexts/AuthContext';
import type { RecorrenciaApi, RecorrenciaPayload } from '../../../api/types';

interface UsuarioComId {
  id?: number;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};

export const useGerenciarRecorrencias = () => {
  const { user } = useAuth();
  const userAuth = user as UsuarioComId | null;

  const [recorrencias, setRecorrencias] = useState<RecorrenciaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Carrega todas as recorrências do usuário
   */
  const carregarRecorrencias = useCallback(async () => {
    if (!userAuth?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dados = await recorrenciaService.listarTodosPorUsuario(userAuth.id);
      setRecorrencias(dados);
    } catch (erro) {
      const mensagem = getErrorMessage(erro);
      setError(mensagem);
      console.error('[useGerenciarRecorrencias] Erro ao carregar:', erro);
    } finally {
      setLoading(false);
    }
  }, [userAuth?.id]);

  /**
   * Carrega recorrências apenas ativas
   */
  const carregarRecorrenciasAtivas = useCallback(async () => {
    if (!userAuth?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dados = await recorrenciaService.listarPorUsuario(userAuth.id);
      setRecorrencias(dados);
    } catch (erro) {
      const mensagem = getErrorMessage(erro);
      setError(mensagem);
      console.error('[useGerenciarRecorrencias] Erro ao carregar recorrências ativas:', erro);
    } finally {
      setLoading(false);
    }
  }, [userAuth?.id]);

  /**
   * Cria nova recorrência
   */
  const criarRecorrencia = useCallback(
    async (payload: RecorrenciaPayload): Promise<RecorrenciaApi | null> => {
      if (isSaving) return null;

      setIsSaving(true);
      setError(null);

      try {
        const novaRecorrencia = await recorrenciaService.criar({
          ...payload,
          fk_usuario: userAuth?.id,
          ativo: true,
        });

        setRecorrencias((prev) => [...prev, novaRecorrencia]);
        Alert.alert('Sucesso', 'Recorrência criada com sucesso!');
        return novaRecorrencia;
      } catch (erro) {
        const mensagem = getErrorMessage(erro);
        setError(mensagem);
        Alert.alert('Erro ao criar recorrência', mensagem);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [userAuth?.id, isSaving]
  );

  /**
   * Atualiza uma recorrência
   */
  const atualizarRecorrencia = useCallback(
    async (id: number, payload: RecorrenciaPayload): Promise<RecorrenciaApi | null> => {
      if (isSaving) return null;

      setIsSaving(true);
      setError(null);

      try {
        const recorrenciaAtualizada = await recorrenciaService.atualizar(id, payload);

        setRecorrencias((prev) =>
          prev.map((r) => (r.id === id ? recorrenciaAtualizada : r))
        );

        Alert.alert('Sucesso', 'Recorrência atualizada com sucesso!');
        return recorrenciaAtualizada;
      } catch (erro) {
        const mensagem = getErrorMessage(erro);
        setError(mensagem);
        Alert.alert('Erro ao atualizar recorrência', mensagem);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving]
  );

  /**
   * Desativa uma recorrência (soft delete)
   */
  const deletarRecorrencia = useCallback(
    async (id: number): Promise<boolean> => {
      if (isSaving) return false;

      setIsSaving(true);
      setError(null);

      try {
        await recorrenciaService.desativar(id);
        setRecorrencias((prev) => prev.filter((r) => r.id !== id));
        Alert.alert('Sucesso', 'Recorrência deletada com sucesso!');
        return true;
      } catch (erro) {
        const mensagem = getErrorMessage(erro);
        setError(mensagem);
        Alert.alert('Erro ao deletar recorrência', mensagem);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving]
  );

  /**
   * Ativa uma recorrência
   */
  const ativarRecorrencia = useCallback(
    async (id: number): Promise<boolean> => {
      if (isSaving) return false;

      setIsSaving(true);
      setError(null);

      try {
        const recorrenciaAtualizada = await recorrenciaService.ativar(id);
        setRecorrencias((prev) =>
          prev.map((r) => (r.id === id ? recorrenciaAtualizada : r))
        );
        Alert.alert('Sucesso', 'Recorrência ativada com sucesso!');
        return true;
      } catch (erro) {
        const mensagem = getErrorMessage(erro);
        setError(mensagem);
        Alert.alert('Erro ao ativar recorrência', mensagem);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving]
  );

  /**
   * Valida dados de uma recorrência
   */
  const validarRecorrencia = useCallback(
    (payload: RecorrenciaPayload): string | null => {
      if (!payload.descricao?.trim()) {
        return 'Descrição é obrigatória';
      }

      if (payload.valor <= 0) {
        return 'Valor deve ser maior que zero';
      }

      if (!payload.dia_inicio) {
        return 'Data de início é obrigatória';
      }

      if (payload.tipo_limite === 'DATA' && !payload.data_fim) {
        return 'Data de término é obrigatória para esse tipo de limite';
      }

      if (payload.tipo_limite === 'OCORRENCIAS' && (!payload.qtd_ocorrencias || payload.qtd_ocorrencias <= 0)) {
        return 'Quantidade de ocorrências deve ser maior que zero';
      }

      const dataInicio = new Date(payload.dia_inicio);
      const dataFim = payload.data_fim ? new Date(payload.data_fim) : null;

      if (dataFim && dataFim < dataInicio) {
        return 'Data de término deve ser após a data de início';
      }

      return null;
    },
    []
  );

  /**
   * Carrega recorrências ao montar componente
   */
  useEffect(() => {
    carregarRecorrenciasAtivas();
  }, [carregarRecorrenciasAtivas]);

  return {
    recorrencias,
    loading,
    error,
    isSaving,
    carregarRecorrencias,
    carregarRecorrenciasAtivas,
    criarRecorrencia,
    atualizarRecorrencia,
    deletarRecorrencia,
    ativarRecorrencia,
    validarRecorrencia,
  };
};
