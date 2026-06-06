import transacaoService from '../../src/api/services/transacaoService';
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

describe('transacaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normaliza resposta paginada', async () => {
    apiMock.get.mockResolvedValue({
      data: {
        data: [
          {
            id: '1',
            descricao: 'Teste',
            valor: '10.5',
            tipo: 'GASTO',
            data_transacao: '2026-05-01',
            parcelado: 'false',
            qtd_parcelas: '2',
            fkInstituicao: '10',
            fkCategoria: '20',
          },
        ],
        page: 2,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasMore: false,
      },
    });

    const result = await transacaoService.listarPaginado({
      _page: 2,
      _limit: 10,
      _sort: 'dataTransacao',
      _order: 'desc',
    });

    expect(apiMock.get).toHaveBeenCalledWith('/transacao', {
      params: {
        _page: 2,
        _limit: 10,
        _sort: 'data_transacao',
        _order: 'desc',
      },
    });

    expect(result.data[0]).toEqual({
      id: '1',
      descricao: 'Teste',
      valor: 10.5,
      tipo: 'GASTO',
      dataTransacao: '2026-05-01',
      parcelado: false,
      qtdParcelas: 2,
      recorrencia: null,
      fimRecorrencia: '',
      ativo: null,
      fkInstituicao: '10',
      fkCategoria: '20',
      criadoEm: '',
      atualizadoEm: '',
    });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });

  it('mapeia payload ao criar transacao', async () => {
    apiMock.post.mockResolvedValue({
      data: {
        id: '10',
        descricao: 'Mercado',
        valor: 80,
        tipo: 'GASTO',
        dataTransacao: '2026-05-10',
        parcelado: false,
        qtdParcelas: 1,
        recorrencia: null,
        fimRecorrencia: null,
        ativo: true,
        fkInstituicao: '1',
        fkCategoria: '2',
      },
    });

    await transacaoService.criar({
      descricao: 'Mercado',
      valor: 80,
      tipo: 'GASTO',
      dataTransacao: '2026-05-10',
      parcelado: false,
      fkInstituicao: '1',
      fkCategoria: '2',
    });

    expect(apiMock.post).toHaveBeenCalledWith('/transacao', {
      descricao: 'Mercado',
      valor: 80,
      tipo: 'GASTO',
      dataTransacao: '2026-05-10',
      parcelado: false,
      ativo: true,
      fkInstituicao: '1',
      fkCategoria: '2',
    });
  });
});
