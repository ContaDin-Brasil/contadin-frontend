export type CategoryType = 'RECEITA' | 'GASTO' | 'GLOBAL';

export type CategoryId = string | number;

export interface Category {
  id: CategoryId;
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
  fkUsuario?: CategoryId | null;
  fk_usuario?: CategoryId | null;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CategoryFormData {
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
  fkUsuario?: CategoryId | null;
}

/**
 * Verifica se a categoria pode ser usada para um tipo de transação
 */
export const podeUsarPara = (categoria: Category, tipo: 'RECEITA' | 'GASTO'): boolean => {
  return categoria.tipo === 'GLOBAL' || categoria.tipo === tipo;
};
