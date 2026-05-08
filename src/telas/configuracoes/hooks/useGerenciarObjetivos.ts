import { useCallback, useEffect, useMemo, useState } from 'react';
import { objetivoGastoService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';
import { extrairUsuarioId } from '../../../utils/normalizacao';
import type { ObjetivoUi } from '@/telas/configuracoes/objetivos/types/objetivo.types';
import { carregarCategoriasObjetivos } from '@/telas/configuracoes/objetivos/utils/objetivoCategorias';
import { mapearObjetivo } from '@/telas/configuracoes/objetivos/utils/objetivoMapper';
import { calcularResumoObjetivos } from '@/telas/configuracoes/objetivos/utils/objetivoResumo';

export const useGerenciarObjetivos = () => {
  const { user } = useAuth();
  const usuarioId = extrairUsuarioId(user);
  const [objetivosAtivos, setObjetivosAtivos] = useState<ObjetivoUi[]>([]);
  const [objetivosConcluidos, setObjetivosConcluidos] = useState<ObjetivoUi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'ativos' | 'concluidos'>('ativos');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const carregarObjetivos = useCallback(async () => {
    if (!usuarioId) {
      setError('Sessao invalida. Faca login novamente.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const termo = debouncedQuery.trim();
      const buscar = termo
        ? (concluido: boolean) =>
            objetivoGastoService.buscarPorNome(termo, usuarioId, concluido)
        : (concluido: boolean) => objetivoGastoService.listarPorUsuario(usuarioId, concluido);

      const [categorias, ativos, concluidos] = await Promise.all([
        carregarCategoriasObjetivos(usuarioId),
        buscar(false),
        buscar(true),
      ]);

      const categoriaMap = new Map(categorias.map((categoria) => [String(categoria.id), categoria.nome]));
      setObjetivosAtivos(ativos.map((item) => mapearObjetivo(item, categoriaMap)));
      setObjetivosConcluidos(concluidos.map((item) => mapearObjetivo(item, categoriaMap)));
    } catch (err: any) {
      setError(err?.message || 'Nao foi possivel carregar os objetivos.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId, debouncedQuery]);

  useEffect(() => {
    carregarObjetivos();
  }, [carregarObjetivos]);

  const objetivos = useMemo(() => {
    return filtroStatus === 'concluidos' ? objetivosConcluidos : objetivosAtivos;
  }, [filtroStatus, objetivosAtivos, objetivosConcluidos]);

  const resumo = useMemo(() => {
    return calcularResumoObjetivos([...objetivosAtivos, ...objetivosConcluidos]);
  }, [objetivosAtivos, objetivosConcluidos]);

  const contagem = useMemo(() => {
    return {
      ativos: objetivosAtivos.length,
      concluidos: objetivosConcluidos.length,
    };
  }, [objetivosAtivos, objetivosConcluidos]);

  return {
    objetivos,
    resumo,
    contagem,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filtroStatus,
    setFiltroStatus,
    recarregar: carregarObjetivos,
  };
};
