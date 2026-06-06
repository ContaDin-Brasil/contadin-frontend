import instituicaoService from '../../src/api/services/instituicaoService';
import api from '../../src/api/config';

jest.mock('../../src/api/config', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
}));

type ApiMock = {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
};

const apiMock = api as unknown as ApiMock;

describe('instituicaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lista instituicoes do usuario e inclui globais', async () => {
    apiMock.get.mockResolvedValue({
      data: [
        { id: 1, nome: 'Banco A', icone: 'A', cor: '#111', tipo: 'BANCO', fkUsuario: 10 },
        { id: 2, nome: 'Banco B', icone: 'B', cor: '#222', tipo: 'BANCO', fkUsuario: 99 },
        { id: 3, nome: 'Banco C', icone: 'C', cor: '#333', tipo: 'BANCO', fkUsuario: null },
      ],
    });

    const result = await instituicaoService.listarPorUsuario(10);

    expect(apiMock.get).toHaveBeenCalledWith('/instituicoes', {
      params: { fkUsuario: 10 },
    });
    expect(result.map((item) => item.id)).toEqual([1, 3]);
  });

  it('mapeia payload ao criar instituicao', async () => {
    apiMock.post.mockResolvedValue({
      data: { id: 5, nome: 'Vale X', icone: 'VX', cor: '#123', tipo: 'VALE', fkUsuario: 10 },
    });

    await instituicaoService.criar({
      nome: 'Vale X',
      icone: 'VX',
      cor: '#123',
      type: 'VALE',
      fkUsuario: 10,
    });

    expect(apiMock.post).toHaveBeenCalledWith('/instituicoes', {
      nome: 'Vale X',
      icone: 'VX',
      cor: '#123',
      tipo: 'VALE',
      ativo: true,
      fkUsuario: 10,
    });
  });

  it('busca instituicao por id e normaliza tipo', async () => {
    apiMock.get.mockResolvedValue({
      data: { id: 8, nome: 'Banco D', icone: 'D', cor: '#444', tipo: 'BANCO', fk_usuario: 10 },
    });

    const result = await instituicaoService.buscarPorId(8);

    expect(apiMock.get).toHaveBeenCalledWith('/instituicoes/8');
    expect(result).toMatchObject({
      id: 8,
      nome: 'Banco D',
      type: 'BANCO',
      fkUsuario: 10,
      fk_usuario: 10,
    });
  });

  it('atualiza instituicao e envia payload normalizado', async () => {
    apiMock.patch.mockResolvedValue({
      data: { id: 4, nome: 'Banco X', icone: 'BX', cor: '#999', tipo: 'BANCO', fkUsuario: 10 },
    });

    await instituicaoService.atualizar(4, {
      nome: 'Banco X',
      icone: 'BX',
      cor: '#999',
      type: 'BANCO',
      fkUsuario: 10,
    });

    expect(apiMock.patch).toHaveBeenCalledWith('/instituicoes/4', {
      nome: 'Banco X',
      icone: 'BX',
      cor: '#999',
      tipo: 'BANCO',
      ativo: true,
      fkUsuario: 10,
    });
  });

  it('deleta instituicao chamando desativar', async () => {
    apiMock.patch.mockResolvedValue({});

    await instituicaoService.deletar(12);

    expect(apiMock.patch).toHaveBeenCalledWith('/instituicoes/12/desativar');
  });
});
