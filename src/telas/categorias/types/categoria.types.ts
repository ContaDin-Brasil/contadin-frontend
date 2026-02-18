export type CategoryType = 'RECEITA' | 'GASTO';

export interface Category {
  id: number;
  nome: string;
  tipo?: CategoryType;
  cor?: string;
  icone?: string;
  fk_usuario: number;
  isSystem?: boolean;
}

export interface CategoryFormData {
  nome: string;
  tipo: CategoryType;
  cor: string;
  icone: string;
}
