import { filtrarCategoriasPorTipo, obterTipoCategoriaPorObjetivo } from '../../src/telas/configuracoes/objetivos/utils/objetivoCategorias';

const categorias = [
  { id: 1, nome: 'Gasto', tipo: 'GASTO' },
  { id: 2, nome: 'Receita', tipo: 'RECEITA' },
  { id: 3, nome: 'Global', tipo: 'GLOBAL' },
];

describe('objetivoCategorias', () => {
  it('retorna categoria RECEITA quando objetivo é AUMENTO_RECEITA', () => {
    expect(obterTipoCategoriaPorObjetivo('AUMENTO_RECEITA')).toBe('RECEITA');
  });

  it('retorna categoria GASTO quando objetivo é LIMITE_GASTO', () => {
    expect(obterTipoCategoriaPorObjetivo('LIMITE_GASTO')).toBe('GASTO');
  });

  it('filtra categorias por tipo e mantem global', () => {
    const result = filtrarCategoriasPorTipo(categorias as any, 'GASTO');
    expect(result.map((item) => item.id)).toEqual([1, 3]);
  });
});

