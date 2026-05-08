import { categoriaService } from '../../../../api';
import type { CategoriaApi, ObjetivoTipoApi } from '../../../../api/types';
import type { TipoCategoriaObjetivo } from '../types/objetivo.types';
import { TIPOS_CATEGORIA_OBJETIVOS } from '../constants/constantesObjetivo';

export const obterTipoCategoriaPorObjetivo = (tipo: ObjetivoTipoApi): TipoCategoriaObjetivo => {
  return tipo === 'AUMENTO_RECEITA' ? 'RECEITA' : 'GASTO';
};

export const filtrarCategoriasPorTipo = (
  categorias: CategoriaApi[],
  tipoCategoria: TipoCategoriaObjetivo,
): CategoriaApi[] => {
  return categorias.filter((categoria) => {
    const tipoCat = categoria?.tipo;
    return !tipoCat || tipoCat === 'GLOBAL' || tipoCat === tipoCategoria;
  });
};

export const carregarCategoriasObjetivos = async (
  usuarioId: string | number,
): Promise<CategoriaApi[]> => {
  const resultados = await Promise.allSettled(
    TIPOS_CATEGORIA_OBJETIVOS.map((tipoCategoria) =>
      categoriaService.listarPorUsuario(usuarioId, tipoCategoria),
    ),
  );

  const mapa = new Map<string, CategoriaApi>();
  resultados.forEach((resultado) => {
    if (resultado.status === 'fulfilled') {
      resultado.value.forEach((categoria) => {
        mapa.set(String(categoria.id), categoria);
      });
    }
  });

  return Array.from(mapa.values());
};
