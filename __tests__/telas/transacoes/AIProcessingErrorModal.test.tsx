import React from 'react';
import { render } from '@testing-library/react-native';
import AIProcessingErrorModal from '../../../src/telas/transacoes/componentes/AIProcessingErrorModal';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('../../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false }),
}));

jest.mock('../../../src/styles/colors', () => ({
  getColorsByTheme: () => ({
    error: '#E31C23',
    overlay: 'rgba(0,0,0,0.5)',
    backgroundLight: '#fff',
    backgroundDark: '#f4f4f4',
    border: '#ddd',
    white: '#fff',
    textPrimary: '#111',
    textSecondary: '#666',
    textTertiary: '#999',
  }),
}));

describe('AIProcessingErrorModal', () => {
  it('mostra mensagem especifica para erro 422 na imagem', () => {
    const { getByText } = render(
      <AIProcessingErrorModal
        visible={true}
        error={{
          title: 'OCR inválido',
          message: 'Imagem inválida',
          kind: 'validation',
          source: 'photo',
          statusCode: 422,
          retryable: true,
        }}
        onClose={jest.fn()}
        onRetry={jest.fn()}
      />,
    );

    expect(
      getByText(/Não foi reconhecido nenhum dado financeiro na imagem/i),
    ).toBeTruthy();
    expect(getByText('Tentar novamente')).toBeTruthy();
  });
});
