/** Idiomas com escrita da direita para a esquerda */
export const IDIOMAS_RTL = ['ar'];

export const ehIdiomaRtl = (idioma) => {
  if (!idioma) return false;
  const base = idioma.split('-')[0];
  return IDIOMAS_RTL.includes(idioma) || IDIOMAS_RTL.includes(base);
};
