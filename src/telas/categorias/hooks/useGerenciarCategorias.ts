import { useState, useEffect } from 'react';
import { categoriaService } from '../../../api';
import { Category, CategoryType, CategoryFormData } from '../types/categoria.types';
import { useAuth } from '../../../contexts/AuthContext';
import { extrairUsuarioId, idsIguais, obterUsuarioIdOuErro } from '../../../utils/normalizacao';

/**
 * Hook para gerenciar categorias
 */
export const useGerenciarCategorias = () => {
  const { user } = useAuth();
  const usuarioIdLogado = extrairUsuarioId(user);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CategoryType>('GASTO');

  /**
   * Carrega categorias do usuário (padrão + personalizadas)
   */
  const carregarCategorias = async () => {
    setLoading(true);
    setError(null);

    const usuarioId = obterUsuarioIdOuErro(usuarioIdLogado, (message) =>
      setError(message),
    );

    if (!usuarioId) {
      setCategorias([]);
      setLoading(false);
      return;
    }
    
    try {
      const termoBusca = debouncedSearchQuery.trim();

      const [categoriasTipo, categoriasGlobais] = await Promise.all([
        termoBusca
          ? categoriaService.buscarPorNome(termoBusca, usuarioId, selectedType)
          : categoriaService.listarPorUsuario(usuarioId, selectedType),
        termoBusca
          ? categoriaService.buscarPorNome(termoBusca, usuarioId, 'GLOBAL')
          : categoriaService.listarPorUsuario(usuarioId, 'GLOBAL'),
      ]);

      const mapaCategorias = new Map<string, Category>();
      [...categoriasTipo, ...categoriasGlobais].forEach((categoria) => {
        mapaCategorias.set(String(categoria.id), categoria);
      });

      setCategorias(Array.from(mapaCategorias.values()));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.mensagem ||
        (err as { message?: string })?.message ||
        'Erro ao carregar categorias';

      console.error('Erro ao carregar categorias:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isCategoriaProtegida = (categoria: Category): boolean => {
    const categoriaUsuarioId = categoria.fkUsuario ?? categoria.fk_usuario ?? null;

    if (categoriaUsuarioId === null || categoriaUsuarioId === undefined) {
      return true;
    }

    if (!usuarioIdLogado) {
      return true;
    }

    return !idsIguais(categoriaUsuarioId, usuarioIdLogado);
  };

  /**
   * Cria uma nova categoria
   */
  const criarCategoria = async (formData: CategoryFormData) => {
    const usuarioId = obterUsuarioIdOuErro(usuarioIdLogado, (message) =>
      setError(message),
    );

    if (!usuarioId) {
      return false;
    }

    try {
      const novaCategoria = {
        nome: formData.nome,
        tipo: formData.tipo,
        cor: formData.cor,
        icone: formData.icone,
        fkUsuario: usuarioId,
      };

      await categoriaService.criar(novaCategoria);
      await carregarCategorias();
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.mensagem ||
        (err as { message?: string })?.message ||
        'Erro ao criar categoria';

      console.error('Erro ao criar categoria:', err);
      setError(message);
      return false;
    }
  };

  /**
   * Atualiza uma categoria existente
   */
  const atualizarCategoria = async (
    id: string | number,
    formData: CategoryFormData,
  ) => {
    const usuarioId = obterUsuarioIdOuErro(usuarioIdLogado, (message) =>
      setError(message),
    );

    if (!usuarioId) {
      return false;
    }

    try {
      const categoria = categorias.find((c) => String(c.id) === String(id));
      if (categoria && isCategoriaProtegida(categoria)) {
        setError('Categorias do sistema não podem ser editadas');
        return false;
      }

      const categoriaAtualizada = {
        nome: formData.nome,
        tipo: formData.tipo,
        cor: formData.cor,
        icone: formData.icone,
        fkUsuario: categoria?.fkUsuario ?? categoria?.fk_usuario ?? usuarioId,
      };

      await categoriaService.atualizar(id, categoriaAtualizada);
      await carregarCategorias();
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.mensagem ||
        (err as { message?: string })?.message ||
        'Erro ao atualizar categoria';

      console.error('Erro ao atualizar categoria:', err);
      setError(message);
      return false;
    }
  };

  /**
   * Deleta uma categoria
   */
  const deletarCategoria = async (id: string | number) => {
    try {
      const categoria = categorias.find((c) => String(c.id) === String(id));
      if (categoria && isCategoriaProtegida(categoria)) {
        setError('Categorias do sistema não podem ser deletadas');
        return false;
      }

      await categoriaService.deletar(id);
      await carregarCategorias();
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; mensagem?: string } } })
          ?.response?.data?.mensagem ||
        (err as { message?: string })?.message ||
        'Erro ao alterar status da categoria';

      console.error('Erro ao deletar categoria:', err);
      setError(message);
      return false;
    }
  };

  /**
   * Filtra categorias por busca e tipo
   */
  const getFilteredCategories = () => {
    return categorias.filter(categoria => {
      const matchesSearch = categoria.nome.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = categoria.tipo === selectedType || categoria.tipo === 'GLOBAL';
      return matchesSearch && matchesType;
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    carregarCategorias();
  }, [selectedType, user, debouncedSearchQuery]);

  return {
    categorias: getFilteredCategories(),
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
    isCategoriaProtegida,
    carregarCategorias,
  };
};
