import usuarioService from '../../src/api/services/usuarioService';
import api from '../../src/api/config';

jest.mock('../../src/api/config', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

type ApiMock = {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

const apiMock = api as unknown as ApiMock;

describe('usuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('atualiza cadastro com dados parciais (editar perfil)', async () => {
    apiMock.patch.mockResolvedValue({
      data: { id: 10, nome: 'Ana', sobrenome: 'Silva', email: 'ana@example.com', telefone: '11999999999' },
    });

    await usuarioService.atualizarCadastro(10, {
      nome: 'Ana',
      sobrenome: 'Silva',
      telefone: '11999999999',
      email: 'ana@example.com',
    });

    expect(apiMock.patch).toHaveBeenCalledWith('/usuarios/10', {
      nome: 'Ana',
      sobrenome: 'Silva',
      telefone: '11999999999',
      email: 'ana@example.com',
    });
  });

  it('desativa conta do usuario', async () => {
    apiMock.patch.mockResolvedValue({});

    await usuarioService.desativar(10);

    expect(apiMock.patch).toHaveBeenCalledWith('/usuarios/10/desativar');
  });

  it('deleta conta do usuario', async () => {
    apiMock.delete.mockResolvedValue({ data: { id: 10, nome: 'Ana' } });

    await usuarioService.deletar(10);

    expect(apiMock.delete).toHaveBeenCalledWith('/usuarios/10');
  });
});
