import authService from '../../src/api/services/authService';
import api from '../../src/api/config';

jest.mock('../../src/api/config', () => ({
  post: jest.fn(),
  patch: jest.fn(),
}));

type ApiMock = {
  post: jest.Mock;
  patch: jest.Mock;
};

const apiMock = api as unknown as ApiMock;

describe('login do authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normaliza payload e resposta de login', async () => {
    apiMock.post.mockResolvedValue({
      data: {
        accessToken: 'token-123',
        id: 10,
        nome: 'Ana',
        sobrenome: 'Silva',
        email: 'ana@example.com',
      },
    });

    const result = await authService.login({ email: '  ana@example.com  ', senha: ' 123 ' });

    expect(apiMock.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ana@example.com',
      senha: '123',
    });
    expect(result.data.token).toBe('token-123');
    expect(result.data.user).toEqual({
      id: 10,
      nome: 'Ana',
      sobrenome: 'Silva',
      email: 'ana@example.com',
    });
  });

  it('falha quando token esta ausente', async () => {
    apiMock.post.mockResolvedValue({ data: { id: 'user-1' } });

    await expect(authService.login({ email: 'a@b.com', senha: 'x' }))
      .rejects
      .toThrow('token ausente');
  });

  it('falha quando id do usuario esta ausente', async () => {
    apiMock.post.mockResolvedValue({ data: { accessToken: 'token-123' } });

    await expect(authService.login({ email: 'a@b.com', senha: 'x' }))
      .rejects
      .toThrow(/id do usuário ausente/);
  });
});

describe('cadastro do authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia payload sem telefone quando ausente', async () => {
    apiMock.post.mockResolvedValue({
      data: { id: 1, nome: 'Ana', sobrenome: 'Silva', email: 'ana@example.com', ativo: true },
    });

    await authService.cadastrar({
      nome: 'Ana',
      sobrenome: 'Silva',
      email: 'ana@example.com',
      senha: '123',
    });

    expect(apiMock.post).toHaveBeenCalledWith('/auth/cadastro', {
      nome: 'Ana',
      sobrenome: 'Silva',
      email: 'ana@example.com',
      senha: '123',
    });
  });
});

describe('alterar senha do authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia payload de alteracao de senha', async () => {
    apiMock.patch.mockResolvedValue({});

    await authService.alterarSenha({
      id: 10,
      senhaAtual: 'atual123',
      novaSenha: 'nova123',
      confirmacaoNovaSenha: 'nova123',
    });

    expect(apiMock.patch).toHaveBeenCalledWith('/auth/senha', {
      id: 10,
      senhaAtual: 'atual123',
      novaSenha: 'nova123',
      confirmacaoNovaSenha: 'nova123',
    });
  });
});
