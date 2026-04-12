export type IdNormalizado = string | number;
export type TipoInstituicao = 'BANCO' | 'VALE';
export const MENSAGEM_SESSAO_INVALIDA = 'Sessao invalida. Faca login novamente.';

export const normalizarId = (value: unknown): IdNormalizado | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' ? trimmed : null;
  }

  return null;
};

export const idValido = (value: unknown): value is IdNormalizado => {
  return normalizarId(value) !== null;
};

export const extrairUsuarioId = (user: unknown): IdNormalizado | null => {
  if (!user || typeof user !== 'object') {
    return null;
  }

  return normalizarId((user as { id?: unknown }).id);
};

export const normalizarTipoInstituicao = (value: unknown): TipoInstituicao => {
  const raw = String(value ?? 'BANCO').trim().toUpperCase();
  return raw === 'VALE' ? 'VALE' : 'BANCO';
};

export const normalizarTipoInstituicaoDaEntidade = (entity: unknown): TipoInstituicao => {
  if (!entity || typeof entity !== 'object') {
    return 'BANCO';
  }

  const source = entity as {
    type?: unknown;
    tipo?: unknown;
    tipoInstituicao?: unknown;
  };

  return normalizarTipoInstituicao(source.type ?? source.tipo ?? source.tipoInstituicao);
};

export const idsIguais = (a: unknown, b: unknown): boolean => {
  const primeiro = normalizarId(a);
  const segundo = normalizarId(b);

  if (primeiro === null || segundo === null) {
    return false;
  }

  return String(primeiro) === String(segundo);
};

export const obterUsuarioIdOuErro = (
  value: unknown,
  onInvalid?: (message: string) => void,
): IdNormalizado | null => {
  const id = normalizarId(value);
  if (id === null) {
    onInvalid?.(MENSAGEM_SESSAO_INVALIDA);
    return null;
  }

  return id;
};
