import ocrService from '../../src/api/services/ocrService';

describe('ocrService', () => {
  const fetchMock = jest.fn();

  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('mapeia erro 422 como validation', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      headers: { get: () => 'application/json' },
      json: async () => ({ detail: [{ msg: 'Imagem inválida' }] }),
      text: async () => '',
    });

    const result = await ocrService.scanTransacaoFromImage({
      uri: 'file://imagem.jpg',
      base64: 'data:image/jpeg;base64,AAAA',
      fileName: 'imagem.jpg',
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      kind: 'validation',
      message: 'Imagem inválida',
      statusCode: 422,
    });
  });

  it('extrai mensagem legivel de json cru em erro 422', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'extraction_error', message: 'O comprovante não parece conter dados financeiros.' }),
      text: async () => '',
    });

    const result = await ocrService.scanTransacaoFromImage({
      uri: 'file://imagem.jpg',
      base64: 'data:image/jpeg;base64,AAAA',
      fileName: 'imagem.jpg',
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      kind: 'validation',
      message: 'O comprovante não parece conter dados financeiros.',
      statusCode: 422,
    });
  });

  it('mapeia erro 500 como server_error', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => 'text/plain' },
      json: async () => ({ detail: 'falha' }),
      text: async () => 'Falha interna',
    });

    const result = await ocrService.scanTransacaoFromImage({
      uri: 'file://imagem.jpg',
      base64: 'data:image/jpeg;base64,AAAA',
      fileName: 'imagem.jpg',
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      kind: 'server_error',
      statusCode: 500,
    });
  });
});
