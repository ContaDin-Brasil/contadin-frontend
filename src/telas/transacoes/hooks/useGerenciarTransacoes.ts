import { useState, useEffect, useRef } from 'react';
import { transacaoService, categoriaService, instituicaoService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';
import { parseTransacaoDate } from '../utils/utilitariosTransacao';
import { extrairUsuarioId, normalizarId } from '../../../utils/normalizacao';
import type {
  Category,
  FiltrosTransacao,
  Institution,
  Transaction,
} from '../types/transacao.types';
import type { TransacaoPayload } from '../../../api/types';

export type Filtros = FiltrosTransacao;

interface CarregarDadosOpcoes {
  instituicaoFixaId?: string | number | null;
  search?: string;
  filtrosOverride?: Filtros;
  ordenacaoOverride?: string;
  silencioso?: boolean;
}

const CATEGORIA_GENERICA_ID = 'SEM_CATEGORIA';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const ORDENACAO_API_MAP: Record<string, { _sort: string; _order: 'asc' | 'desc' }> = {
  'Mais recentes': { _sort: 'dataTransacao', _order: 'desc' },
  'Mais antigas': { _sort: 'dataTransacao', _order: 'asc' },
  'Maior valor': { _sort: 'valor', _order: 'desc' },
  'Menor valor': { _sort: 'valor', _order: 'asc' },
  'A-Z': { _sort: 'descricao', _order: 'asc' },
  'Z-A': { _sort: 'descricao', _order: 'desc' },
};

/**
 * Hook customizado para gerenciar transações
 * Busca e gerencia transações da API.
 */
export const useGerenciarTransacoes = () => {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [instituicoes, setInstituicoes] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState('Período Completo');
  const [ordenacao, setOrdenacao] = useState('Mais recentes');
  const ordenacaoRef = useRef('Mais recentes');
  
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: 'TODOS',
    instituicoes: [],
    categorias: [],
    valorMin: '',
    valorMax: '',
    apenasParcelado: false,
    apenasRecorrente: false,
    dataInicio: '',
    dataFim: '',
  });

  const usuarioId = extrairUsuarioId(user);

  const normalizarDataFiltroParaApi = (valor: string): string | undefined => {
    if (!valor || typeof valor !== 'string') {
      return undefined;
    }

    const texto = valor.trim();
    if (!texto) {
      return undefined;
    }

    if (/^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/.test(texto)) {
      return texto.slice(0, 10);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      const [dia, mes, ano] = texto.split('/');
      return `${ano}-${mes}-${dia}`;
    }

    return undefined;
  };

  const normalizarValorFiltro = (valor: string): number | undefined => {
    if (!valor || typeof valor !== 'string') {
      return undefined;
    }

    const texto = valor.trim();
    if (!texto) {
      return undefined;
    }

    const normalizado = texto.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const numero = Number(normalizado);

    return Number.isFinite(numero) ? numero : undefined;
  };

  const mapearOrdenacaoParaApi = (criterio: string) => {
    return ORDENACAO_API_MAP[criterio] ?? ORDENACAO_API_MAP['Mais recentes'];
  };

  const construirParametrosBackend = (
    filtrosAtivos: Filtros,
    ordenacaoAtiva: string,
    search?: string,
  ) => {
    const valorMin = normalizarValorFiltro(filtrosAtivos.valorMin);
    const valorMax = normalizarValorFiltro(filtrosAtivos.valorMax);
    const dataInicio = normalizarDataFiltroParaApi(filtrosAtivos.dataInicio);
    const dataFim = normalizarDataFiltroParaApi(filtrosAtivos.dataFim);

    return {
      ...mapearOrdenacaoParaApi(ordenacaoAtiva),
      tipo: filtrosAtivos.tipo !== 'TODOS' ? filtrosAtivos.tipo : undefined,
      valorGte: valorMin,
      valorLte: valorMax,
      parcelado: filtrosAtivos.apenasParcelado ? true : undefined,
      recorrente: filtrosAtivos.apenasRecorrente ? true : undefined,
      dataTransacaoGte: dataInicio,
      dataTransacaoLte: dataFim,
      search: search && search.trim() ? search.trim() : undefined,
    };
  };

  const ordenarTransacoesPorCriterio = (items: Transaction[], criterio: string): Transaction[] => {
    const copia = [...items];

    switch (criterio) {
      case 'Mais antigas':
        return copia.sort(
          (a, b) =>
            parseTransacaoDate(a.dataTransacao).getTime() - parseTransacaoDate(b.dataTransacao).getTime(),
        );
      case 'Maior valor':
        return copia.sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor));
      case 'Menor valor':
        return copia.sort((a, b) => Math.abs(a.valor) - Math.abs(b.valor));
      case 'A-Z':
        return copia.sort((a, b) => String(a.descricao ?? '').localeCompare(String(b.descricao ?? '')));
      case 'Z-A':
        return copia.sort((a, b) => String(b.descricao ?? '').localeCompare(String(a.descricao ?? '')));
      case 'Mais recentes':
      default:
        return copia.sort(
          (a, b) =>
            parseTransacaoDate(b.dataTransacao).getTime() - parseTransacaoDate(a.dataTransacao).getTime(),
        );
    }
  };

  const carregarCategoriasParaTransacoes = async (
    usuarioIdAtual: string | number,
  ): Promise<Category[]> => {
    const service = categoriaService as typeof categoriaService & {
      listarParaTransacoes?: (id: string | number) => Promise<Category[]>;
    };

    if (typeof service.listarParaTransacoes === 'function') {
      return await service.listarParaTransacoes(usuarioIdAtual);
    }

    const resultados = await Promise.allSettled([
      categoriaService.listarPorUsuario(usuarioIdAtual, 'GASTO'),
      categoriaService.listarPorUsuario(usuarioIdAtual, 'RECEITA'),
      categoriaService.listarPorUsuario(usuarioIdAtual, 'GLOBAL'),
    ]);

    const mapa = new Map<string, Category>();

    resultados.forEach((resultado) => {
      if (resultado.status === 'fulfilled') {
        (resultado.value ?? []).forEach((categoria: Category) => {
          mapa.set(String(categoria.id), categoria);
        });
      }
    });

    return Array.from(mapa.values());
  };

  const carregarTransacoesPorInstituicoes = async (
    instituicoesUsuario: Institution[],
    filtrosAtivos: Filtros,
    paramsBase: Record<string, unknown>,
    instituicaoFixaId?: string | number | null,
  ): Promise<Transaction[]> => {
    if (!Array.isArray(instituicoesUsuario) || instituicoesUsuario.length === 0) {
      return [];
    }

    let instituicoesAlvo = [...instituicoesUsuario];

    if (instituicaoFixaId !== undefined && instituicaoFixaId !== null) {
      instituicoesAlvo = instituicoesAlvo.filter(
        (instituicao) => String(instituicao.id) === String(instituicaoFixaId),
      );
    }

    if (filtrosAtivos.instituicoes.length > 0) {
      instituicoesAlvo = instituicoesAlvo.filter((instituicao) =>
        filtrosAtivos.instituicoes.some((id) => String(id) === String(instituicao.id)),
      );
    }

    if (instituicoesAlvo.length === 0) {
      return [];
    }

    const categoriasSelecionadas =
      filtrosAtivos.categorias.length > 0 ? filtrosAtivos.categorias : [undefined];

    const requisicoes: Array<Promise<Transaction[]>> = [];
    const contextoRequisicoes: Array<{ instituicaoId: string | number; categoriaId?: string | number }> = [];

    instituicoesAlvo.forEach((instituicao) => {
      categoriasSelecionadas.forEach((categoriaId) => {
        requisicoes.push(
          transacaoService.listar({
            ...paramsBase,
            fkInstituicao: instituicao.id,
            ...(categoriaId !== undefined ? { fkCategoria: categoriaId } : {}),
          }),
        );

        contextoRequisicoes.push({
          instituicaoId: instituicao.id,
          ...(categoriaId !== undefined ? { categoriaId } : {}),
        });
      });
    });

    const resultados = await Promise.allSettled(requisicoes);

    const mapaTransacoes = new Map<string, Transaction>();

    resultados.forEach((resultado, index) => {
      if (resultado.status === 'fulfilled') {
        const contexto = contextoRequisicoes[index];
        const instituicaoId = contexto?.instituicaoId;
        const categoriaId = contexto?.categoriaId;

        (resultado.value ?? []).forEach((transacao: Transaction) => {
          const transacaoId = String(transacao.id ?? '');
          if (!transacaoId) return;

          const transacaoComRelacionamentos: Transaction = {
            ...transacao,
            fkInstituicao: transacao.fkInstituicao ?? instituicaoId ?? null,
            fkCategoria: transacao.fkCategoria ?? categoriaId ?? CATEGORIA_GENERICA_ID,
          };

          mapaTransacoes.set(transacaoId, transacaoComRelacionamentos);
        });
      }
    });

    return Array.from(mapaTransacoes.values());
  };

  const garantirCategoriasDasTransacoes = async (
    transacoesCarregadas: Transaction[],
    categoriasCarregadas: Category[],
  ): Promise<{ categoriasConsolidadas: Category[]; transacoesConsolidadas: Transaction[] }> => {
    const categoriasPorId = new Map<string, Category>();
    let transacoesConsolidadas = [...(transacoesCarregadas ?? [])];

    (categoriasCarregadas ?? []).forEach((categoria) => {
      const id = normalizarId(categoria?.id);
      if (id !== null) {
        categoriasPorId.set(String(id), categoria);
      }
    });

    const idsCategoriasNasTransacoes = new Set<string>();

    (transacoesCarregadas ?? []).forEach((transacao) => {
      const idCategoria = normalizarId(transacao?.fkCategoria);
      if (idCategoria === null || String(idCategoria) === CATEGORIA_GENERICA_ID) {
        return;
      }
      idsCategoriasNasTransacoes.add(String(idCategoria));
    });

    const idsFaltantes = Array.from(idsCategoriasNasTransacoes).filter(
      (id) => !categoriasPorId.has(id),
    );

    if (idsFaltantes.length > 0) {
      const resultados = await Promise.allSettled(
        idsFaltantes.map((id) => categoriaService.buscarPorId(id)),
      );

      resultados.forEach((resultado, index) => {
        const idSolicitado = idsFaltantes[index];

        if (resultado.status === 'fulfilled') {
          const categoria = resultado.value;
          const idCategoria = normalizarId(categoria?.id ?? idSolicitado);
          if (idCategoria !== null) {
            categoriasPorId.set(String(idCategoria), categoria);
          }
          return;
        }

        console.warn(`Falha ao buscar categoria por id=${idSolicitado}`, resultado.reason);
      });
    }

    const categoriasConsolidadas = Array.from(categoriasPorId.values());

    return {
      categoriasConsolidadas,
      transacoesConsolidadas,
    };
  };

  /**
   * Carrega transações e dados relacionados ao montar (ou quando o usuário mudar)
   */
  useEffect(() => {
    if (usuarioId) {
      carregarDados();
    }
  }, [usuarioId]);

  /**
   * Carrega dados da API.
   * - Se não houver instituição, evita chamada de categorias para não disparar 500 no backend.
   * - Se categorias/instituições falharem, mantém transações funcionais.
   */
  const carregarDados = async (opcoes: CarregarDadosOpcoes = {}) => {
    if (!usuarioId) return;

    if (!opcoes.silencioso) {
      setLoading(true);
    }
    setError(null);

    const filtrosAtivos = opcoes.filtrosOverride ?? filtros;
    const ordenacaoAtiva = opcoes.ordenacaoOverride ?? ordenacaoRef.current;
    const searchAtivo = opcoes.search;
    const paramsBase = construirParametrosBackend(filtrosAtivos, ordenacaoAtiva, searchAtivo);
    
    try {
      console.log('🔄 [LOAD] Carregando dados da API...');
      
      let instituicoesCarregadas: Institution[] = [];
      let categoriasCarregadas: Category[] = [];
      let totalTransacoesCarregadas = 0;

      try {
        instituicoesCarregadas = await instituicaoService.listarPorUsuario(usuarioId);
        setInstituicoes(instituicoesCarregadas);
      } catch (errorInstituicoes) {
        console.warn('⚠️ Falha ao carregar instituições. Continuando sem instituições.', errorInstituicoes);
        setInstituicoes([]);
      }

      if (instituicoesCarregadas.length === 0) {
        setCategorias([]);
      } else {
        try {
          categoriasCarregadas = await carregarCategoriasParaTransacoes(usuarioId);
          setCategorias(categoriasCarregadas);
        } catch (errorCategorias) {
          console.warn('⚠️ Falha ao carregar categorias.', errorCategorias);
          setCategorias([]);
        }
      }

      try {
        const transacoesUsuario = await carregarTransacoesPorInstituicoes(
          instituicoesCarregadas,
          filtrosAtivos,
          paramsBase,
          opcoes.instituicaoFixaId,
        );

        const {
          categoriasConsolidadas,
          transacoesConsolidadas,
        } = await garantirCategoriasDasTransacoes(
          transacoesUsuario,
          categoriasCarregadas,
        );
        categoriasCarregadas = categoriasConsolidadas;
        setCategorias(categoriasCarregadas);

        totalTransacoesCarregadas = transacoesConsolidadas.length;
        setTransacoes(ordenarTransacoesPorCriterio(transacoesConsolidadas, ordenacaoAtiva));
        setError(null);
      } catch (errorTransacoes) {
        console.warn('⚠️ Falha ao carregar transações por instituição.', errorTransacoes);
        setTransacoes([]);
        setError('Não foi possível carregar transações. Tente novamente.');
      }

      console.log(`📊 [LOAD] Dados carregados da API:`);
      console.log(`   • ${totalTransacoesCarregadas} transações`);
      console.log(`   • ${categoriasCarregadas.length} categorias`);
      console.log(`   • ${instituicoesCarregadas.length} instituições`);
    } catch (err: unknown) {
      console.error('Erro ao carregar transações:', err);
      setTransacoes([]);
      setCategorias([]);
      setInstituicoes([]);
      setError(getErrorMessage(err, 'Erro ao carregar transações'));
    } finally {
      if (!opcoes.silencioso) {
        setLoading(false);
      }
    }
  };

  const aplicarFiltros = async (
    novosFiltros: Filtros,
    opcoes: Omit<CarregarDadosOpcoes, 'filtrosOverride'> = {},
  ) => {
    setFiltros(novosFiltros);
    await carregarDados({ ...opcoes, filtrosOverride: novosFiltros });
  };

  const aplicarOrdenacao = async (
    novaOrdenacao: string,
    opcoes: Omit<CarregarDadosOpcoes, 'ordenacaoOverride'> = {},
  ) => {
    ordenacaoRef.current = novaOrdenacao;
    setOrdenacao(novaOrdenacao);
    await carregarDados({ ...opcoes, ordenacaoOverride: novaOrdenacao });
  };

  /**
   * Busca transações por período
   */
  const buscarPorPeriodo = async (dataInicio: string, dataFim: string) => {
    await aplicarFiltros({
      ...filtros,
      dataInicio,
      dataFim,
    });
  };

  /**
   * Busca transações por tipo
   */
  const buscarPorTipo = async (tipo: 'GASTO' | 'RECEITA') => {
    await aplicarFiltros({
      ...filtros,
      tipo,
    });
  };

  /**
   * Busca categoria por ID
   */
  const buscarCategoria = (categoriaId: string | number) => {
    return categorias.find((cat) => String(cat.id) === String(categoriaId));
  };

  /**
   * Busca instituição por ID
   */
  const buscarInstituicao = (instituicaoId: string | number) => {
    return instituicoes.find((inst) => String(inst.id) === String(instituicaoId));
  };

  /**
   * Deleta uma transação
   */
  const deletarTransacao = async (id: string | number) => {
    try {
      await transacaoService.deletar(id);
      setTransacoes((prev) =>
        ordenarTransacoesPorCriterio(
          prev.filter((t) => String(t.id) !== String(id)),
          ordenacao,
        ),
      );
    } catch (err: unknown) {
      console.error('Erro ao deletar transação:', err);
      setError(getErrorMessage(err, 'Erro ao deletar transação'));
      throw err;
    }
  };

  /**
   * Cria uma nova transação
   */
  const criarTransacao = async (transacao: TransacaoPayload) => {
    try {
      const novaTransacao = await transacaoService.criar(transacao);
      setTransacoes((prev) => ordenarTransacoesPorCriterio([novaTransacao, ...prev], ordenacao));
      return novaTransacao;
    } catch (err: unknown) {
      console.error('Erro ao criar transação:', err);
      setError(getErrorMessage(err, 'Erro ao criar transação'));
      throw err;
    }
  };

  /**
   * Atualiza uma transação
   */
  const atualizarTransacao = async (id: string | number, transacao: TransacaoPayload) => {
    try {
      const transacaoAtualizada = await transacaoService.atualizar(id, transacao);
      setTransacoes((prev) =>
        ordenarTransacoesPorCriterio(
          prev.map((t) => (String(t.id) === String(id) ? transacaoAtualizada : t)),
          ordenacao,
        )
      );
      return transacaoAtualizada;
    } catch (err: unknown) {
      console.error('Erro ao atualizar transação:', err);
      setError(getErrorMessage(err, 'Erro ao atualizar transação'));
      throw err;
    }
  };

  return {
    // Estados
    transacoes,
    categorias,
    instituicoes,
    loading,
    error,
    periodo,
    ordenacao,
    filtros,
    
    // Modificadores
    setPeriodo,
    setOrdenacao,
    setFiltros,
    aplicarFiltros,
    aplicarOrdenacao,
    
    // Ações
    carregarDados,
    buscarPorPeriodo,
    buscarPorTipo,
    buscarCategoria,
    buscarInstituicao,
    deletarTransacao,
    criarTransacao,
    atualizarTransacao,
  };
};
