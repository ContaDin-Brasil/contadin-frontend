export type CategoryType = 'RECEITA' | 'GASTO' | 'GLOBAL';

export interface Category {
  id: number;
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
  fk_usuario: number | null;
}

export interface CategoryFormData {
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
}

/**
 * Verifica se a categoria é padrão (global)
 */
export const isPadrao = (categoria: Category): boolean => {
  return categoria.fk_usuario === null;
};

/**
 * Verifica se a categoria pode ser usada para um tipo de transação
 */
export const podeUsarPara = (categoria: Category, tipo: 'RECEITA' | 'GASTO'): boolean => {
  return categoria.tipo === 'GLOBAL' || categoria.tipo === tipo;
};
