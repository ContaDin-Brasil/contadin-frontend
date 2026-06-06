import { BANCOS_PADRAO, VALES_PADRAO, getInstituicoesPadrao } from '../../src/telas/carteira/constants/instituicoesPadrao';

describe('getInstituicoesPadrao', () => {
  it('retorna somente bancos quando tipo é banco', () => {
    expect(getInstituicoesPadrao('banco')).toEqual(BANCOS_PADRAO);
  });

  it('retorna somente vales quando tipo é vale', () => {
    expect(getInstituicoesPadrao('vale')).toEqual(VALES_PADRAO);
  });

  it('retorna bancos e vales quando tipo é todos', () => {
    expect(getInstituicoesPadrao('todos')).toEqual([...BANCOS_PADRAO, ...VALES_PADRAO]);
  });
});
