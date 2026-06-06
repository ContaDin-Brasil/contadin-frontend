import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

jest.mock('../../src/componentes/modais/ModalSessaoExpirada', () => () => null);

type AsyncStorageMock = {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  multiRemove: jest.Mock;
};

const asyncStorageMock = AsyncStorage as unknown as AsyncStorageMock;

const StateReader = () => {
  const { token, user, loading } = useAuth();

  return (
    <Text testID="auth-state">
      {JSON.stringify({ token, user, loading })}
    </Text>
  );
};

describe('AuthProvider', () => {
  const fetchMock = jest.fn();

  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('limpa a sessao persistida quando o token salvo nao e mais valido', async () => {
    asyncStorageMock.getItem
      .mockResolvedValueOnce('token-antigo')
      .mockResolvedValueOnce(JSON.stringify({ id: 10, nome: 'Ana', sobrenome: 'Silva', email: 'ana@example.com' }));
    fetchMock.mockResolvedValue({ ok: false, status: 401 });

    const { getByTestId } = render(
      <AuthProvider>
        <StateReader />
      </AuthProvider>,
    );

    await waitFor(() => {
      const state = JSON.parse(String(getByTestId('auth-state').props.children));
      expect(state.loading).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/10'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-antigo',
        }),
      }),
    );
    expect(asyncStorageMock.multiRemove).toHaveBeenCalledWith(['@contadin:token', '@contadin:user']);
  });

  it('mantem a sessao persistida quando o token salvo continua valido', async () => {
    asyncStorageMock.getItem
      .mockResolvedValueOnce('token-valido')
      .mockResolvedValueOnce(JSON.stringify({ id: 11, nome: 'Bruno', sobrenome: 'Santos', email: 'bruno@example.com' }));
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    const { getByTestId } = render(
      <AuthProvider>
        <StateReader />
      </AuthProvider>,
    );

    await waitFor(() => {
      const state = JSON.parse(String(getByTestId('auth-state').props.children));
      expect(state.loading).toBe(false);
      expect(state.token).toBe('token-valido');
      expect(state.user).toMatchObject({
        id: 11,
        nome: 'Bruno',
        sobrenome: 'Santos',
        email: 'bruno@example.com',
      });
    });

    expect(asyncStorageMock.multiRemove).not.toHaveBeenCalled();
  });
});