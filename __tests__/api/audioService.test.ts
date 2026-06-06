import audioService from '../../src/api/services/audioService';

describe('audioService', () => {
  const fetchMock = jest.fn();

  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('mapeia erro 403 como forbidden', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      headers: { get: () => 'text/plain' },
      text: async () => 'acesso negado',
    });

    const result = await audioService.sendAudioForTranscription('file://audio.m4a');

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      kind: 'forbidden',
      statusCode: 403,
    });
  });

  it('extrai a mensagem legivel de json cru no erro do audio', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify({ error: 'extraction_error', message: 'O áudio não parece descrever uma transação financeira.' }),
    });

    const result = await audioService.sendAudioForTranscription('file://audio.m4a');

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      kind: 'validation',
      statusCode: 422,
      message: 'O áudio não parece descrever uma transação financeira.',
    });
  });

  it('mapeia AbortError como timeout', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    fetchMock.mockRejectedValue(abortError);

    const result = await audioService.sendAudioForTranscription('file://audio.m4a', 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      kind: 'timeout',
    });
  });
});
