export type CategoryType = 'RECEITA' | 'GASTO' | 'GLOBAL';

export interface Category {
  id: string;
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
  fkUsuario?: string | null;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CategoryFormData {
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
  fkUsuario?: string | null;
}

/**
 * Verifica se a categoria é padrão (global)
 */
export const isPadrao = (categoria: Category): boolean => {
  return categoria.fkUsuario == null;
};

/**
 * Verifica se a categoria pode ser usada para um tipo de transação
 */
export const podeUsarPara = (categoria: Category, tipo: 'RECEITA' | 'GASTO'): boolean => {
  return categoria.tipo === 'GLOBAL' || categoria.tipo === tipo;
};
