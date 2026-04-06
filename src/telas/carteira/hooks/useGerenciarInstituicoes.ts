import { useState, useEffect } from 'react';
import { instituicaoService } from '../../../api';
import { InstituicaoApi } from '../../../api/types';

/**
 * Hook para gerenciar e listar instituições/contas do usuário
 */
export const useGerenciarInstituicoes = () => {
  const [instituicoes, setInstituicoes] = useState<InstituicaoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = 1; // TODO: Pegar do contexto de autenticação

  /**
   * Carrega instituições do usuário
   */
  const carregarInstituicoes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await instituicaoService.listarPorUsuario(usuarioId);
      setInstituicoes(data);
    } catch (err: any) {
      console.error('Erro ao carregar instituições:', err);
      setError(err.message || 'Erro ao carregar instituições');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-carrega instituições na montagem do componente
   */
  useEffect(() => {
    carregarInstituicoes();
  }, []);

  return {
    instituicoes,
    loading,
    error,
    carregarInstituicoes,
  };
};

export default useGerenciarInstituicoes;
