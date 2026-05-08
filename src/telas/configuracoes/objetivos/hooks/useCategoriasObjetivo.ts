import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CategoriaApi, ObjetivoTipoApi } from '../../../../api/types';
import { carregarCategoriasObjetivos, filtrarCategoriasPorTipo, obterTipoCategoriaPorObjetivo } from '../utils/objetivoCategorias';
import type { TipoCategoriaObjetivo } from '../types/objetivo.types';

type UseCategoriasObjetivoParams = {
  usuarioId: string | number | null;
  tipoObjetivo: ObjetivoTipoApi;
  categoriaInicialId?: string | number | null;
  debounceMs?: number;
};

type UseCategoriasObjetivoResult = {
  categoriasExibidas: CategoriaApi[];
  categoriaSearch: string;
  setCategoriaSearch: (value: string) => void;
  categoriaSelecionadaId: string | null;
  setCategoriaSelecionadaId: (value: string | null) => void;
  carregandoCategorias: boolean;
  categoriasErro: string;
  tipoCategoria: TipoCategoriaObjetivo;
  recarregarCategorias: () => Promise<void>;
};

export const useCategoriasObjetivo = ({
  usuarioId,
  tipoObjetivo,
  categoriaInicialId,
  debounceMs = 500,
}: UseCategoriasObjetivoParams): UseCategoriasObjetivoResult => {
  const [categorias, setCategorias] = useState<CategoriaApi[]>([]);
  const [categoriaSearch, setCategoriaSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string | null>(
    categoriaInicialId !== undefined && categoriaInicialId !== null
      ? String(categoriaInicialId)
      : null,
  );
  const [carregandoCategorias, setCarregandoCategorias] = useState(false);
  const [categoriasErro, setCategoriasErro] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(categoriaSearch), debounceMs);
    return () => clearTimeout(timer);
  }, [categoriaSearch, debounceMs]);

  const recarregarCategorias = useCallback(async () => {
    if (!usuarioId) return;

    setCarregandoCategorias(true);
    setCategoriasErro('');

    try {
      const data = await carregarCategoriasObjetivos(usuarioId);
      setCategorias(data ?? []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategorias([]);
      setCategoriasErro('Nao foi possivel carregar as categorias.');
    } finally {
      setCarregandoCategorias(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    recarregarCategorias();
  }, [recarregarCategorias]);

  const tipoCategoria = useMemo(() => {
    return obterTipoCategoriaPorObjetivo(tipoObjetivo);
  }, [tipoObjetivo]);

  const categoriasFiltradas = useMemo(() => {
    return filtrarCategoriasPorTipo(categorias, tipoCategoria);
  }, [categorias, tipoCategoria]);

  const categoriasExibidas = useMemo(() => {
    const termo = debouncedSearch.trim().toLowerCase();
    if (!termo) return categoriasFiltradas;

    return categoriasFiltradas.filter((cat) => {
      return String(cat.nome || '').toLowerCase().includes(termo);
    });
  }, [categoriasFiltradas, debouncedSearch]);

  useEffect(() => {
    if (!categoriasFiltradas.length) return;

    const categoriaInicial =
      categoriaInicialId !== undefined && categoriaInicialId !== null
        ? String(categoriaInicialId)
        : null;

    const categoriaAtual = categoriaSelecionadaId || categoriaInicial;
    const categoriaAtualValida = categoriaAtual
      ? categoriasFiltradas.some((cat) => String(cat.id) === String(categoriaAtual))
      : false;

    if (categoriaAtualValida) {
      if (categoriaSelecionadaId !== categoriaAtual) {
        setCategoriaSelecionadaId(String(categoriaAtual));
      }
      return;
    }

    setCategoriaSelecionadaId(String(categoriasFiltradas[0].id));
  }, [categoriasFiltradas, categoriaInicialId, categoriaSelecionadaId]);

  return {
    categoriasExibidas,
    categoriaSearch,
    setCategoriaSearch,
    categoriaSelecionadaId,
    setCategoriaSelecionadaId,
    carregandoCategorias,
    categoriasErro,
    tipoCategoria,
    recarregarCategorias,
  };
};
