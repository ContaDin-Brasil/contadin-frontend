import categoriaService from '../../src/api/services/categoriaService';
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

describe('categoriaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lista categorias do usuario e inclui globais', async () => {
    apiMock.get.mockResolvedValue({
      data: [
        { id: 1, nome: 'Alimentacao', fkUsuario: 10, tipo: 'GASTO' },
        { id: 2, nome: 'Outra', fkUsuario: 99, tipo: 'GASTO' },
        { id: 3, nome: 'Sistema', fkUsuario: null, tipo: 'GASTO' },
      ],
    });

    const result = await categoriaService.listarPorUsuario(10, 'GASTO');

    expect(apiMock.get).toHaveBeenCalledWith('/categorias', {
      params: { fkUsuario: 10, tipoCategoria: 'GASTO' },
    });
    expect(result.map((item) => item.id)).toEqual([1, 3]);
  });

  it('nao cria categoria sem fkUsuario', async () => {
    await expect(
      categoriaService.criar({
        nome: 'Teste',
        icone: 'x',
        cor: '#000',
        tipo: 'GASTO',
      } as any),
    ).rejects.toThrow('Usuario invalido');
  });

  it('normaliza resposta quando backend envia envelope content', async () => {
    apiMock.get.mockResolvedValue({
      data: {
        content: [
          { id: 5, nome: 'Bonus', fk_usuario: 10, tipo: 'RECEITA' },
        ],
      },
    });

    const result = await categoriaService.listar({ fkUsuario: 10, tipoCategoria: 'RECEITA' });

    expect(apiMock.get).toHaveBeenCalledWith('/categorias', {
      params: { fkUsuario: 10, tipoCategoria: 'RECEITA' },
    });
    expect(result[0]).toMatchObject({
      id: 5,
      nome: 'Bonus',
      tipo: 'RECEITA',
      fkUsuario: 10,
      fk_usuario: 10,
    });
  });

  it('aceita fk_usuario no payload de criacao', async () => {
    apiMock.post.mockResolvedValue({
      data: { id: 7, nome: 'Outros', icone: 'x', cor: '#111', tipo: 'GASTO', fk_usuario: 10 },
    });

    await categoriaService.criar({
      nome: 'Outros',
      icone: 'x',
      cor: '#111',
      tipo: 'GASTO',
      fk_usuario: 10,
    } as any);

    expect(apiMock.post).toHaveBeenCalledWith('/categorias', {
      nome: 'Outros',
      icone: 'x',
      cor: '#111',
      tipo: 'GASTO',
      fkUsuario: 10,
    });
  });

  it('busca categoria por id e normaliza fk_usuario', async () => {
    apiMock.get.mockResolvedValue({
      data: { id: 9, nome: 'Casa', icone: 'home', cor: '#000', tipo: 'GASTO', fk_usuario: 10 },
    });

    const result = await categoriaService.buscarPorId(9);

    expect(apiMock.get).toHaveBeenCalledWith('/categorias/9');
    expect(result).toMatchObject({
      id: 9,
      nome: 'Casa',
      fkUsuario: 10,
      fk_usuario: 10,
    });
  });

  it('atualiza categoria com payload parcial', async () => {
    apiMock.patch.mockResolvedValue({
      data: { id: 2, nome: 'Nova', icone: 'x', cor: '#111', tipo: 'GASTO', fkUsuario: 10 },
    });

    await categoriaService.atualizar(2, { nome: 'Nova', fkUsuario: 10 });

    expect(apiMock.patch).toHaveBeenCalledWith('/categorias/2', {
      nome: 'Nova',
      fkUsuario: 10,
    });
  });

  it('deleta categoria via alternar-status', async () => {
    apiMock.patch.mockResolvedValue({});

    await categoriaService.deletar(3);

    expect(apiMock.patch).toHaveBeenCalledWith('/categorias/3/alternar-status');
  });
});
