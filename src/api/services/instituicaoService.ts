import axios from 'axios';
import api from '../config';
import transacaoService from './transacaoService';
import type {
  InstituicaoApi,
  InstituicaoComTransacoes,
  InstituicaoPayload,
  ResultadoLimpezaOrfaos,
} from '../types';

type AnyObject = Record<string, unknown>;
type TipoInstituicaoBackend = 'BANCO' | 'VALE';

const unwrapData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

const asString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
};

const asId = (value: unknown): string | number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  return undefined;
};

const toBackendTipo = (value: unknown): TipoInstituicaoBackend => {
  return asString(value)?.toUpperCase() === 'VALE' ? 'VALE' : 'BANCO';
};

const normalizeInstituicao = (item: unknown): InstituicaoApi => {
  const source = (item && typeof item === 'object' ? item : {}) as AnyObject;
  const tipoBackend = toBackendTipo(source.tipo ?? source.type);

  const instituicao: InstituicaoApi = {
    id: asId(source.id) ?? '',
    nome: asString(source.nome) ?? '',
    icone: asString(source.icone) ?? '',
    cor: asString(source.cor) ?? '#999999',
    type: tipoBackend,
    fk_usuario: asId(source.fkUsuario ?? source.fk_usuario),
    fkUsuario: asId(source.fkUsuario ?? source.fk_usuario),
    ativo:
      typeof source.ativo === 'boolean'
        ? source.ativo
        : true,
    criadoEm: asString(source.criadoEm),
    atualizadoEm: asString(source.atualizadoEm),
  };

  return instituicao;
};

const mapPayloadToBackend = (instituicao: InstituicaoPayload): Record<string, unknown> => {
  const source = instituicao as unknown as AnyObject;

  const tipoBackend = toBackendTipo(source.type);
  const fkUsuario = asId(source.fkUsuario ?? source.fk_usuario);

  const payload: Record<string, unknown> = {
    nome: asString(source.nome) ?? '',
    icone: asString(source.icone) ?? '',
    cor: asString(source.cor) ?? '#999999',
    tipo: tipoBackend,
  };

  if (typeof source.ativo === 'boolean') {
    payload.ativo = source.ativo;
  } else {
    payload.ativo = true;
  }

  if (fkUsuario !== undefined) {
    payload.fkUsuario = fkUsuario;
  }

  return payload;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const status = error.response?.status;
  const data = error.response?.data as
    | { message?: string; mensagem?: string; error?: string }
    | undefined;

  const backendMessage = data?.message ?? data?.mensagem ?? data?.error;

  if (status === 401) {
    return backendMessage || 'Nao autenticado. Faça login novamente.';
  }

  if (status === 400) {
    return backendMessage || 'Dados invalidos para instituicao.';
  }

  if (status === 422) {
    return backendMessage || 'Regra de negocio invalida para instituicao.';
  }

  if (status === 500) {
    return backendMessage || 'Erro interno ao processar instituicao.';
  }

  return backendMessage || fallback;
};

const handleServiceError = (error: unknown, fallback: string): never => {
  throw new Error(getErrorMessage(error, fallback));
};

/**
 * Serviço de Instituições
 * Gerencia operações relacionadas a bancos, vales e carteiras
 */
const instituicaoService = {
  /**
   * Lista instituições por usuário
   * O backend exige fkUsuario na query.
   */
  listar: async (usuarioId: string | number): Promise<InstituicaoApi[]> => {
    return instituicaoService.listarPorUsuario(usuarioId);
  },

  /**
   * Busca instituições por usuário
   * @param {number} usuarioId - ID do usuário
   */
  listarPorUsuario: async (usuarioId: string | number): Promise<InstituicaoApi[]> => {
    try {
      const response = await api.get<InstituicaoApi[] | { data: InstituicaoApi[] }>('/instituicoes', {
        params: { fkUsuario: usuarioId },
      });
      const data = unwrapData<InstituicaoApi[] | undefined>(response.data);
      const lista = Array.isArray(data) ? data : [];
      return lista.map((item) => normalizeInstituicao(item));
    } catch (error) {
      handleServiceError(error, 'Erro ao buscar instituicoes do usuario.');
    }
  },

  /**
   * Busca uma instituição por ID
   * @param {string | number} id - ID da instituição
   */
  buscarPorId: async (id: string | number): Promise<InstituicaoApi> => {
    try {
      const response = await api.get<InstituicaoApi | { data: InstituicaoApi }>(`/instituicoes/${id}`);
      const data = unwrapData<InstituicaoApi>(response.data);
      return normalizeInstituicao(data);
    } catch (error) {
      handleServiceError(error, 'Erro ao buscar instituicao por id.');
    }
  },

  /**
   * Cria uma nova instituição
   * @param {object} instituicao - Dados da instituição
   */
  criar: async (instituicao: InstituicaoPayload): Promise<InstituicaoApi> => {
    try {
      const payload = mapPayloadToBackend(instituicao);
      const response = await api.post<InstituicaoApi | { data: InstituicaoApi }>(
        '/instituicoes',
        payload,
      );
      const data = unwrapData<InstituicaoApi>(response.data);
      return normalizeInstituicao(data);
    } catch (error) {
      handleServiceError(error, 'Erro ao criar instituicao.');
    }
  },

  /**
   * Atualiza uma instituição
   * @param {string | number} id - ID da instituição
   * @param {object} instituicao - Dados atualizados
   */
  atualizar: async (id: string | number, instituicao: InstituicaoPayload): Promise<InstituicaoApi> => {
    try {
      const payload = mapPayloadToBackend(instituicao);
      const response = await api.patch<InstituicaoApi | { data: InstituicaoApi }>(
        `/instituicoes/${id}`,
        payload,
      );
      const data = unwrapData<InstituicaoApi>(response.data);
      return normalizeInstituicao(data);
    } catch (error) {
      handleServiceError(error, 'Erro ao atualizar instituicao.');
    }
  },

  /**
   * Desativa instituição por ID (exclusão lógica)
   */
  desativar: async (id: string | number): Promise<void> => {
    try {
      await api.patch(`/instituicoes/${id}/desativar`);
    } catch (error) {
      handleServiceError(error, 'Erro ao desativar instituicao.');
    }
  },

  /**
   * Deleta uma instituição e TODAS as transações relacionadas
   * @param {string | number} id - ID da instituição
   */
  deletar: async (id: string | number): Promise<void> => {
    await instituicaoService.desativar(id);
  },

  /**
   * Remove transações órfãs (referenciando instituições que não existem mais)
   * @param {string | number} usuarioId - ID do usuário
   */
  limparTransacoesOrfas: async (usuarioId: string | number): Promise<ResultadoLimpezaOrfaos> => {
    try {
      // 1. Buscar todas as instituições do usuário
      const instituicoes = await instituicaoService.listarPorUsuario(usuarioId);
      const idsValidos = instituicoes.map((inst) => inst.id);
      const idsValidosNormalizados = new Set(idsValidos.map((id) => String(id)));

      // 2. Buscar todas as transações
      const transacoes = await transacaoService.listar();

      // 3. Filtrar transações órfãs
      const transacoesOrfas = transacoes.filter(
        (t) => !idsValidosNormalizados.has(String(t.fk_instituicao)),
      );

      // 4. Deletar transações órfãs
      let deletadas = 0;
      for (const transacao of transacoesOrfas) {
        await transacaoService.deletar(transacao.id);
        deletadas++;
      }

      return {
        deletadas,
        transacoesOrfas: transacoesOrfas.map((t) => ({
          id: t.id,
          descricao: t.descricao,
          fk_instituicao: t.fk_instituicao,
        })),
      };
    } catch (error) {
      handleServiceError(error, 'Erro ao limpar transacoes orfas.');
    }
  },

  /**
   * Busca instituições com suas transações
   * @param {string | number} usuarioId - ID do usuário
   */
  listarComTransacoes: async (usuarioId: string | number): Promise<InstituicaoComTransacoes[]> => {
    const [instituicoes, transacoes] = await Promise.all([
      instituicaoService.listarPorUsuario(usuarioId),
      transacaoService.listar(),
    ]);

    return instituicoes.map((instituicao) => ({
      ...instituicao,
      transacao: transacoes.filter((transacao) => String(transacao.fk_instituicao) === String(instituicao.id)),
    }));
  },
};

export default instituicaoService;
