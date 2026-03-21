import { useState, useEffect } from 'react';
import { categoriaService } from '../../../api';
import { Category, CategoryType, CategoryFormData, isPadrao } from '../types/categoria.types';

/**
 * Hook para gerenciar categorias
 */
export const useGerenciarCategorias = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CategoryType>('GASTO');

  const usuarioId = 1; // TODO: Pegar do contexto de autenticação

  /**
   * Carrega categorias do usuário (padrão + personalizadas)
   */
  const carregarCategorias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await categoriaService.listarPorUsuario(usuarioId);
      setCategorias(data);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cria uma nova categoria
   */
  const criarCategoria = async (formData: CategoryFormData) => {
    try {
      const novaCategoria = {
        nome: formData.nome,
        tipo: formData.tipo,
        cor: formData.cor,
        icone: formData.icone,
        fk_usuario: usuarioId,
      };

      await categoriaService.criar(novaCategoria);
      await carregarCategorias();
      return true;
    } catch (err: any) {
      console.error('Erro ao criar categoria:', err);
      setError(err.message || 'Erro ao criar categoria');
      return false;
    }
  };

  /**
   * Atualiza uma categoria existente
   */
  const atualizarCategoria = async (id: number, formData: CategoryFormData) => {
    try {
      // Verifica se é categoria padrão
      const categoria = categorias.find(c => c.id === id);
      if (categoria && isPadrao(categoria)) {
        setError('Categorias padrão não podem ser editadas');
        return false;
      }

      const categoriaAtualizada = {
        nome: formData.nome,
        tipo: formData.tipo,
        cor: formData.cor,
        icone: formData.icone,
        fk_usuario: categoria?.fk_usuario || usuarioId, // Mantém o fk_usuario original
      };

      await categoriaService.atualizar(id, categoriaAtualizada);
      await carregarCategorias();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar categoria:', err);
      setError(err.message || 'Erro ao atualizar categoria');
      return false;
    }
  };

  /**
   * Deleta uma categoria
   */
  const deletarCategoria = async (id: number) => {
    try {
      const categoria = categorias.find(c => c.id === id);
      if (categoria && isPadrao(categoria)) {
        setError('Categorias padrão não podem ser deletadas');
        return false;
      }

      await categoriaService.deletar(id);
      await carregarCategorias();
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar categoria:', err);
      setError(err.message || 'Erro ao deletar categoria');
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
    carregarCategorias();
  }, []);

  return {
    categorias: getFilteredCategories(),
    categoriasTodasTipos: categorias, // Todas sem filtro de tipo
    categoriasPadrao: categorias.filter(c => isPadrao(c)),
    categoriasPersonalizadas: categorias.filter(c => !isPadrao(c)),
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
    carregarCategorias,
  };
};
