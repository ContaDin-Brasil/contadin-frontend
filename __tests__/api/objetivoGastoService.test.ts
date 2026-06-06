import objetivoGastoService from '../../src/api/services/objetivoGastoService';
import api from '../../src/api/config';

jest.mock('../../src/api/config', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

type ApiMock = {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

const apiMock = api as unknown as ApiMock;

describe('objetivoGastoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lista objetivos do usuario com filtro de concluido', async () => {
    apiMock.get.mockResolvedValue({ data: [] });

    await objetivoGastoService.listarPorUsuario(7, true);

    expect(apiMock.get).toHaveBeenCalledWith('/objetivos', {
      params: { fkUsuario: 7, concluido: true },
    });
  });

  it('cria objetivo com payload completo', async () => {
    apiMock.post.mockResolvedValue({ data: { id: 1 } });

    await objetivoGastoService.criar({
      tipoObjetivo: 'LIMITE_GASTO',
      nome: 'Limite delivery',
      descricao: null,
      valor: 100,
      dataInicio: '2026-05-01',
      dataFim: '2026-05-31',
      prioridade: null,
      fkCategoria: 2,
      fkUsuario: 7,
    });

    expect(apiMock.post).toHaveBeenCalledWith('/objetivos', {
      tipoObjetivo: 'LIMITE_GASTO',
      nome: 'Limite delivery',
      descricao: null,
      valor: 100,
      dataInicio: '2026-05-01',
      dataFim: '2026-05-31',
      prioridade: null,
      fkCategoria: 2,
      fkUsuario: 7,
    });
  });

  it('busca objetivos por nome com concluido falso', async () => {
    apiMock.get.mockResolvedValue({ data: [] });

    await objetivoGastoService.buscarPorNome('academia', 7, false);

    expect(apiMock.get).toHaveBeenCalledWith('/objetivos/nome', {
      params: { nome: 'academia', fkUsuario: 7, concluido: false },
    });
  });

  it('deleta objetivo pelo id', async () => {
    apiMock.delete.mockResolvedValue({});

    await objetivoGastoService.deletar(99);

    expect(apiMock.delete).toHaveBeenCalledWith('/objetivos/99');
  });

  it('busca objetivo por id', async () => {
    apiMock.get.mockResolvedValue({ data: { id: 4, nome: 'Meta', tipoObjetivo: 'LIMITE_GASTO' } });

    const result = await objetivoGastoService.buscarPorId(4);

    expect(apiMock.get).toHaveBeenCalledWith('/objetivos/4');
    expect(result).toMatchObject({ id: 4, nome: 'Meta', tipoObjetivo: 'LIMITE_GASTO' });
  });

  it('atualiza objetivo com payload parcial', async () => {
    apiMock.patch.mockResolvedValue({ data: { id: 4, nome: 'Meta 2' } });

    await objetivoGastoService.atualizar(4, { nome: 'Meta 2' });

    expect(apiMock.patch).toHaveBeenCalledWith('/objetivos/4', { nome: 'Meta 2' });
  });
});
